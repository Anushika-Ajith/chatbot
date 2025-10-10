
interface UserData {
  id: string;
  email: string;
  role: string;
}

interface AuthResponse {
  message: string;
  token: string;
  user: UserData;
}


/**
 * Authenticates a user by sending credentials to the login endpoint.
 *
 * @param email The user's email address.
 * @param password The user's password.
 * @returns A Promise that resolves to the successful authentication data (AuthResponse).
 * @throws An error if the network request fails or the server returns an error status (e.g., 401 Unauthorized).
 */
export async function login(email: string, password: string) {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/login`;

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        
        'Content-Type': 'application/json',
        
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

   
    if (!response.ok) {
      
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        // If parsing fails (e.g., non-JSON error response)
        throw new Error(`Login failed with status ${response.status}: ${response.statusText}`);
      }
      
      // Throw a specific error based on the server's response
      const errorMessage = errorData.message || `Login failed. Status: ${response.status}`;
      throw new Error(errorMessage);
    }

    
     const data = await response.json();
    console.log("Login successful. Token received.");
    return data;

  } catch (error) {
    
    console.error('Network or API Error during login:', error);
    
    throw error;
  }
}

export async function signup(name:string, email:string, password:string) {
    const registrationEndpoint =`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/register`; 

    try {
        const response = await fetch(registrationEndpoint, {
            method: 'POST',
            headers: {
                
                'Content-Type': 'application/json',
            },
            
            body: JSON.stringify({ name, email, password }),
        });

        const data = await response.json();

        
        if (response.ok) {
            
            return {
                success: true,
                message: data.message, 
                user: data.user,      
            };
        } else {
            
            return {
                success: false,
                message: data.error || 'Registration failed due to an unknown error.',
            };
        }

    } catch (error) {
        
        console.error("Network or fetch error during registration:", error);
        return {
            success: false,
            message: 'A network error occurred. Please try again.',
        };
    }
}