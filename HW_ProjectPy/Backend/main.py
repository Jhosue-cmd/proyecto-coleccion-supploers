from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from model.supplier import Supplier, SupplierResponse
from controller.supplier_controller import SupplierController
from typing import List

app = FastAPI()


origins = [
    "http://localhost:5173", 
    "http://localhost:3000",
    "*" 
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

controller = SupplierController()

@app.get("/api/suppliers", response_model=List[SupplierResponse])
def get_suppliers():
   
    print("GET request received") 
    return controller.get_all()

@app.post("/api/suppliers", response_model=SupplierResponse)
def create_supplier(supplier: Supplier):
    print(f"POST request received: {supplier}")
    return controller.create(supplier)


@app.put("/api/suppliers/{uid}/rating")
def update_rating(uid: str, value: float):
    try:
        return controller.update_rating(uid, value)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.delete("/api/suppliers/{uid}")
def delete_supplier(uid: str):
    try:
        return controller.delete(uid)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))