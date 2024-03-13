/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store';

const useFetch = <T,>(url: string, errorMessage: string): T | null => {
    const [data, setData] = useState(null);
    const showLoadingIcon = useAppStore((state) => state.showLoadingIcon);
    const openMessageDialog = useAppStore((state) => state.openMessageDialog);   

    useEffect(() => {
        const abortController = new AbortController();

        console.log('useFetch', url);
        showLoadingIcon(true);

        fetch(url, { 
            signal: abortController.signal 
        })
        .then((res: Response) => {
            if (!res.ok) {
                throw new Error(errorMessage);
            }

            return res.json();    
        })
        .then((data: React.SetStateAction<null>) => {   
            console.log('fetch data', data);   
            setData(data);
        })
        .catch((error: unknown) => {
            if ((error as Error).name === 'AbortError') {
                return;
            }
        
            openMessageDialog({
                title: 'Błąd aplikacji',
                text: (error as Error).message
            });
        })
        .finally(() => {
            showLoadingIcon(false);                        
        });               
    
        //cleanup, przerwij wywolanie fetch jesli unmount
        return () => {
            abortController.abort();
            showLoadingIcon(false);   
            
            console.log('abort useFetch');
        }
    }, [url]); 

    return data;
}

export default useFetch;
