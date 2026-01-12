from pydantic import BaseModel
from typing import List, Optional

# Base Model with Spanish attributes
class Supplier(BaseModel):
    proveedor: str
    contacto: str
    celular: str
    categorias: List[str]
    rating: float
    pedidos: int

# Response Model (Includes internal ID and calculated fields)
class SupplierResponse(Supplier):
    uid: str
    business_status: str # Calculated field (e.g., "Top Tier", "Regular")