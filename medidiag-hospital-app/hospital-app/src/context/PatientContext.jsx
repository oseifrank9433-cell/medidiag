import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { api } from '../utils/apiClient';

const PatientContext = createContext(null);

export function PatientProvider({ children }) {
  const { clinician } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadRecords() {
      if (!clinician) {
        setRecords([]);
        return;
      }
      setLoading(true);
      try {
        const data = await api.get('/records');
        setRecords(data);
      } catch {
        setRecords([]);
      } finally {
        setLoading(false);
      }
    }
    loadRecords();
  }, [clinician]);

  async function addRecord(record) {
    const created = await api.post('/records', record);
    setRecords((prev) => [created, ...prev]);
    return created;
  }

  function getRecord(id) {
    // id arrives as a string from the URL param; record ids are numeric.
    return records.find((r) => String(r.id) === String(id));
  }

  async function deleteRecord(id) {
    await api.delete(`/records/${id}`);
    setRecords((prev) => prev.filter((r) => String(r.id) !== String(id)));
  }

  return (
    <PatientContext.Provider value={{ records, loading, addRecord, getRecord, deleteRecord }}>
      {children}
    </PatientContext.Provider>
  );
}

export function usePatients() {
  return useContext(PatientContext);
}

// --- Admin: facility-wide records ---
// The backend scopes these to the caller's own facility automatically.

export async function getAllFacilityRecords() {
  return api.get('/admin/records');
}

export async function clearFacilityRecords() {
  return api.delete('/admin/records');
}
