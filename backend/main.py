from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from calculator import calculate_amortization

## FastAPI initialization
app = FastAPI(title="Loanscope API", description="API for calculating loan amortization schedules.")

##CORS middleware configuration to allow frontend to make requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

##Defining the request model using Pydantic
##Automatically validates data types
class LoanRequest(BaseModel):
    principal: float
    annual_rate: float
    monthly_payment: float

##Checks the health and returns a status if online
@app.get("/")
def root():
    return {"status": "ok", "message": "Loanscope API running"}

##Calculation that gets inputs and returns amortization sechdule
@app.post("/calculate")
def calculate(loan: LoanRequest):
    result = calculate_amortization(principal=loan.principal,
    annual_rate=loan.annual_rate, monthly_payment=loan.monthly_payment,)
    return result