"""
Payment webhooks for Payme and Click.
Both providers call these endpoints to confirm/cancel transactions.
"""
import hashlib
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from _app import models
from _app.config import settings
from _app.database import get_db

router = APIRouter(prefix="/payments", tags=["payments"])


# ─────────────────────────────── PAYME ────────────────────────────────
@router.post("/payme/create")
async def payme_create_url(
    enrollment_id: int,
    db: Session = Depends(get_db)
):
    """Generate Payme checkout URL for an enrollment."""
    enrollment = db.query(models.Enrollment).filter(models.Enrollment.id == enrollment_id).first()
    if not enrollment:
        raise HTTPException(404, "Enrollment topilmadi")

    # Determine amount
    amount = 0
    if enrollment.plan_id:
        plan = db.query(models.models.Plan).filter(models.Plan.id == enrollment.plan_id).first()
        amount = plan.price * 100 if plan else 0  # tiyin
    elif enrollment.course_id:
        course = db.query(models.Course).filter(models.Course.id == enrollment.course_id).first()
        amount = course.price * 100 if course else 0

    if amount == 0:
        # Free — mark as paid directly
        enrollment.is_paid = True
        db.commit()
        return {"redirect_url": f"{settings.FRONTEND_URL}/dashboard?enrolled=1", "free": True}

    # Create pending payment record
    payment = models.Payment(
        enrollment_id=enrollment_id,
        amount=amount,
        provider=models.PaymentProvider.payme,
    )
    db.add(payment); db.commit(); db.refresh(payment)

    # Build Payme checkout URL
    # Format: https://checkout.paycom.uz/<merchant_id>/<params_base64>
    import base64, json
    params = {
        "m": settings.PAYME_MERCHANT_ID,
        "ac.enrollment_id": enrollment_id,
        "a": amount,
        "c": f"{settings.FRONTEND_URL}/checkout/success",
    }
    encoded = base64.b64encode(json.dumps(params).encode()).decode()
    url = f"{settings.PAYME_URL}/{settings.PAYME_MERCHANT_ID}/{encoded}"
    return {"redirect_url": url, "payment_id": payment.id}


@router.post("/payme/webhook")
async def payme_webhook(request: Request, db: Session = Depends(get_db)):
    """Handle Payme JSON-RPC 2.0 webhook calls."""
    body = await request.json()
    method = body.get("method")
    params = body.get("params", {})

    if method == "CheckPerformTransaction":
        return {"id": body.get("id"), "result": {"allow": True}}

    elif method in ("CreateTransaction", "PerformTransaction"):
        enrollment_id = params.get("account", {}).get("enrollment_id")
        if enrollment_id:
            enrollment = db.query(models.Enrollment).filter(models.Enrollment.id == int(enrollment_id)).first()
            if enrollment:
                payment = db.query(models.Payment).filter(
                    models.Payment.enrollment_id == int(enrollment_id),
                    models.Payment.provider == models.PaymentProvider.payme
                ).first()
                if payment and method == "PerformTransaction":
                    payment.status = models.PaymentStatus.paid
                    payment.transaction_id = params.get("id")
                    enrollment.is_paid = True
                    db.commit()
        import time
        return {
            "id": body.get("id"),
            "result": {
                "create_time": int(time.time() * 1000),
                "transaction": params.get("id", ""),
                "state": 2 if method == "PerformTransaction" else 1,
            }
        }

    elif method == "CancelTransaction":
        enrollment_id = params.get("account", {}).get("enrollment_id")
        if enrollment_id:
            payment = db.query(models.Payment).filter(
                models.Payment.enrollment_id == int(enrollment_id),
                models.Payment.provider == models.PaymentProvider.payme
            ).first()
            if payment:
                payment.status = models.PaymentStatus.failed
                db.commit()
        import time
        return {
            "id": body.get("id"),
            "result": {"cancel_time": int(time.time() * 1000), "transaction": params.get("id", ""), "state": -1}
        }

    return {"id": body.get("id"), "result": {}}


# ─────────────────────────────── CLICK ────────────────────────────────
@router.post("/click/prepare")
async def click_prepare(request: Request, db: Session = Depends(get_db)):
    """Click PREPARE step."""
    form = await request.form()
    enrollment_id = form.get("merchant_trans_id")
    amount = form.get("amount")
    click_trans_id = form.get("click_trans_id")

    enrollment = db.query(models.Enrollment).filter(models.Enrollment.id == int(enrollment_id)).first()
    if not enrollment:
        return {"error": -5, "error_note": "Enrollment topilmadi"}

    payment = models.Payment(
        enrollment_id=int(enrollment_id),
        amount=int(float(amount) * 100),
        provider=models.PaymentProvider.click,
        transaction_id=str(click_trans_id),
    )
    db.add(payment); db.commit(); db.refresh(payment)
    return {"click_trans_id": click_trans_id, "merchant_trans_id": enrollment_id,
            "merchant_prepare_id": payment.id, "error": 0, "error_note": "Success"}


@router.post("/click/complete")
async def click_complete(request: Request, db: Session = Depends(get_db)):
    """Click COMPLETE step."""
    form = await request.form()
    merchant_prepare_id = form.get("merchant_prepare_id")
    error = int(form.get("error", 0))

    payment = db.query(models.Payment).filter(models.Payment.id == int(merchant_prepare_id)).first()
    if not payment:
        return {"error": -6, "error_note": "Payment topilmadi"}

    if error == 0:
        payment.status = models.PaymentStatus.paid
        enrollment = db.query(models.Enrollment).filter(models.Enrollment.id == payment.enrollment_id).first()
        if enrollment:
            enrollment.is_paid = True
    else:
        payment.status = models.PaymentStatus.failed
    db.commit()

    return {"click_trans_id": form.get("click_trans_id"),
            "merchant_trans_id": payment.enrollment_id,
            "merchant_confirm_id": payment.id, "error": 0, "error_note": "Success"}
