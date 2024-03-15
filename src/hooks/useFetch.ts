/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { useAppStore } from '../store';
import api from '../helpers/api';

const useFetch = <T,>(url: string, errorMessage: string): T | null => {
    const [data, setData] = useState(null);
    const showLoadingIcon = useAppStore((state) => state.showLoadingIcon);
    const openMessageDialog = useAppStore((state) => state.openMessageDialog);   

    useEffect(() => {
        const abortController = new AbortController();

        console.log('useFetch', url);
        showLoadingIcon(true);

        api.get(url, { 
            signal: abortController.signal 
        })
        .then((res) => {            
            //console.log('fetch data', res.data);   
            setData(res.data);
        })
        .catch((error) => {
            if (error.name === 'AbortError' || 
                error.name === 'CanceledError') return;
            
            openMessageDialog({
                title: 'Błąd aplikacji',
                text: `${error.response.status} - ${errorMessage}`
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
