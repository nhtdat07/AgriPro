import { createContext, useState, useEffect } from 'react';

export const UserContext = createContext({})

export function UserContextProvider({ children }) {
    console.log('useEffect');
    const [user, setUser] = useState(null);
    // useEffect(() => {
    //     if (!user) {
    //         axios.get('/profile').then(({ data }) => {
    //             console.log(data)
    //             setUser(data)
    //         })
    //     }
    // }, [])

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    )
}

