/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { useAppStore } from '../store';
import useApi from './useApi';

const useFetch = <T,>(url: string, errorMessage: string): T | null => {
    const [data, setData] = useState(null);
    const showLoadingIcon = useAppStore((state) => state.showLoadingIcon);
    const openMessageDialog = useAppStore((state) => state.openMessageDialog);   
    const api = useApi();

    useEffect(() => {
        const abortController = new AbortController();

        //console.log('useFetch', url);
        showLoadingIcon(true);

        api.get(url, { 
            signal: abortController.signal 
        })
        .then((res) => {            
            setData(res.data as React.SetStateAction<null>);
        })
        .catch((error) => {
            if (error.name === 'AbortError' || 
                error.name === 'CanceledError' ||
                error.response?.status === 401) return;
            
            openMessageDialog({
                title: 'Błąd aplikacji',
                text: error.response ? `${error.response.status} - ` : '' + `${errorMessage}`
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
