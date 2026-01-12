import { useEffect, useState } from 'react';
import { SupplierAPI } from './models/supplier_api';
import './App.css'; 

function App() {
  const [suppliers, setSuppliers] = useState([]);
  
  const [form, setForm] = useState({ 
    proveedor: '', 
    contacto: '', 
    celular: '', 
    categorias: '', 
    rating: 5.0, 
    pedidos: 0 
  });

  const loadData = async () => {
    try {
      console.log("loanding...");
      const data = await SupplierAPI.getAll();
      setSuppliers(data);
      console.log("Loanding Data  :", data);
    } catch (error) {
      console.error("Error loading data", error);
      alert("Error to connect servidor.");
    }
  };

  useEffect(() => { loadData() }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
  
    const payload = {
        proveedor: form.proveedor,
        contacto: form.contacto,
        celular: form.celular,
        categorias: form.categorias.split(',').map(c => c.trim()), 
        rating: parseFloat(form.rating),
        pedidos: parseInt(form.pedidos)
    };

    console.log("Send:", payload);

    try {
      await SupplierAPI.create(payload);
      alert("¡Saved!");
      setForm({ ...form, proveedor: '', contacto: '', celular: '', categorias: '' }); // Limpiar
      loadData();
    } catch (error) {
      console.error(error);
      alert("Error not saved.");
    }
  };

  const handleUpdateRating = async (uid) => {
    const newVal = prompt("New Rating (Enter a number):");
    if(!newVal) return;
    try {
      await SupplierAPI.updateRating(uid, parseFloat(newVal));
      loadData();
    } catch (err) {
      alert("Error: " + (err.response?.data?.detail || " Unknown error"));
    }
  };

  const handleDelete = async (uid) => {
    if(!confirm("Are you sure you want to delete?")) return;
    try {
      await SupplierAPI.delete(uid);
      loadData();
    } catch (err) {
      alert("Error: " + (err.response?.data?.detail || "Unknown error"));
    }
  };

  
  const getStatusClass = (status) => {
    if (status === 'Gold Partner') return 'status-gold';
    if (status === 'High Volume') return 'status-high';
    return 'status-standard';
  };

  return (
    <div className="container">
      <h1>Gestión de Proveedores</h1>
      
    
      <div className="card">
        <h3>Nuevo Proveedor</h3>
        <form onSubmit={handleCreate}>
          <input 
            placeholder="Nombre Proveedor" 
            value={form.proveedor}
            onChange={e => setForm({...form, proveedor: e.target.value})} 
            required 
          />
          <input 
            placeholder="Nombre Contacto" 
            value={form.contacto}
            onChange={e => setForm({...form, contacto: e.target.value})} 
            required 
          />
          <input 
            placeholder="Celular" 
            value={form.celular}
            onChange={e => setForm({...form, celular: e.target.value})} 
            required 
          />
          <input 
            placeholder="Categorias (separadas por coma)" 
            value={form.categorias}
            onChange={e => setForm({...form, categorias: e.target.value})} 
            required 
          />
          
         
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={{fontSize: '12px', color: '#666'}}>Rating (1.0 - 5.0)</label>
            <input 
              type="number" step="0.1" min="1" max="5"
              value={form.rating} 
              onChange={e => setForm({...form, rating: e.target.value})} 
            />
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={{fontSize: '12px', color: '#666'}}>Pedidos Totales</label>
            <input 
              type="number" 
              value={form.pedidos} 
              onChange={e => setForm({...form, pedidos: e.target.value})} 
            />
          </div>

          <button type="submit" className="full-width">Guardar Proveedor</button>
        </form>
      </div>


      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Proveedor</th>
              <th>Contacto</th>
              <th>Celular</th>
              <th>Categorias</th>
              <th>Rating</th>
              <th>Pedidos</th>
              <th>Estatus</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.length === 0 ? (
               <tr><td colSpan="8" style={{textAlign: 'center'}}>No hay datos. Asegúrate de encender el Backend.</td></tr>
            ) : (
              suppliers.map(s => (
                <tr key={s.uid}>
                  <td style={{fontWeight: 'bold'}}>{s.proveedor}</td>
                  <td>{s.contacto}</td>
                  <td>{s.celular}</td>
                  <td>
                    {s.categorias.map((c, i) => (
                      <span key={i} style={{background:'#eee', padding:'2px 6px', borderRadius:'4px', margin:'2px', fontSize:'11px'}}>
                        {c}
                      </span>
                    ))}
                  </td>
                  <td>⭐ {s.rating}</td>
                  <td>{s.pedidos}</td>
                  <td>
                    <span className={`badge ${getStatusClass(s.business_status)}`}>
                      {s.business_status}
                    </span>
                  </td>
                  <td>
                    <button className="edit-btn" onClick={() => handleUpdateRating(s.uid)}>Nota</button>
                    <button className="delete-btn" onClick={() => handleDelete(s.uid)}>Borrar</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;