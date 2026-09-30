import math
from datetime import date

def calculate_amortization(
        principal: float, annual_rate: float, monthly_payment: float
):
    ## converting dollars to integer cents
    cent_balance = int(round(principal * 100))
    cent_payment = int(round(monthly_payment * 100))
    monthly_rate  = (annual_rate / 100.0) / 12.0

    #REQ-5: Reject monthly payment <= monthly interest
    first_month_interest = int(round(cent_balance * monthly_rate))
    if cent_payment <= first_month_interest:
        return {
            "error": "Monthly payment is less than or equal to monthly interest. Loan would never be paid off at that rate."
        }

    schedule = []
    cumulative_interest_cents = 0
    cumulative_principal_cents = 0
    month = 0

    #REQ-8: schedule at 1200 months
    max_months = 1200

    #REQ-6: Loop until payoff or max months is reached
    while cent_balance > 0 and month < max_months:
        month += 1
        #monthly interest in cents
        interest_cents = int(round(cent_balance * monthly_rate))
        #check final payment month
        if cent_balance + interest_cents <= cent_payment:
            actual_payment_cents = cent_balance + interest_cents
            principal_paid_cents = cent_balance
            cent_balance = 0
        else:
            actual_payment_cents = cent_payment
            principal_paid_cents = actual_payment_cents - interest_cents
            cent_balance -= principal_paid_cents

        #REQ-7: Calculate cumulative interest and principal
        cumulative_interest_cents += interest_cents
        cumulative_principal_cents += principal_paid_cents

        ##Structure the schedule data for each month
        schedule.append({
            "payment_number": month,
            "payment_amount": actual_payment_cents / 100.0,
            "principal_paid": principal_paid_cents / 100.0,
            "interest_paid": interest_cents / 100.0,
            "remaining_balance": cent_balance / 100.0,
            "cumulative_principal": cumulative_principal_cents / 100.0,
            "cumulative_interest": cumulative_interest_cents / 100.0,
        })

        ##REQ-6: Calculate payoff date
        today = date.today()
        total_months = month
        payoff_year = today.year + (today.month + total_months -1) // 12
        payoff_month = (today.month + total_months -1) % 12 + 1
        payoff_date = f"{payoff_year}-{payoff_month:02d}-01"

        ##REQ-8: Display if over 1200 months
        over_months = cent_balance > 0 and month >= max_months

    return {
        "months": total_months,
        "Years": round(total_months / 12, 1),
        "payoff_date": payoff_date,
        "total_interest_paid": cumulative_interest_cents / 100.0,
        "total_principal_paid": cumulative_principal_cents / 100.0,
        "months_over": over_months,
        "Over_1200_months_message": ("The loan has exceeded 100 years (1200 months)."
        if over_months
        else None),
        "schedule": schedule
    }




