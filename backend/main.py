from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
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
    principal: float = Field(ge=1.0, le=100000000.0, description="Principal balance in USD")
    annual_rate: float = Field(ge=0.0, le=40.0, description="Annual interest rate in percent")
    monthly_payment: float = Field(ge=1.0, le=100000000.0,description="Monthly payment in USD, at least $1.00")

##Checks the health and returns a status if online
@app.get("/")
def root():
    return {"status": "ok", "message": "Loanscope API running"}

##Calculation that gets inputs and returns amortization sechdule
@app.post("/calculate")
def calculate(loan: LoanRequest):
    result = calculate_amortization(principal=loan.principal,
    annual_rate=loan.annual_rate, monthly_payment=loan.monthly_payment,)

    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    return result