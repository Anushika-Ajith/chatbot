
export async function getAppointmentsByUser(userId: string, token?: string) {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/appointments/user/${userId}`;

  try {
    const res = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      cache: "no-store", 
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch appointments: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    
    if (data?.data) return data.data;
    if (data?.appointments) return data.appointments;
    return data;
  } catch (error) {
    console.error("❌ Error fetching user appointments:", error);
    return [];
  }
}
