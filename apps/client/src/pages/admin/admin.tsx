import { useAlert } from '@context/alert-context.tsx';
import type { SelectChangeEvent } from '@mui/material';
import { Button, Select, MenuItem, InputLabel } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import AdminCatList from './admin-cat-list.tsx';
import AuthStore from '@stores/AuthStore.ts';

const Admin = () => {
    const {user} = AuthStore;
    const { showAlert } = useAlert();
    const navigate = useNavigate();
    const [cronJob, setCronJob] = useState('');

    useEffect(() => {
        const checkUserRights = async () => {
            try {
                if (user?.role !== 'ADMIN') {
                    showAlert('Error', 'Sul pole privileege, et kuva näha');
                    navigate(`/dashboard`);
                }
            } catch (_error) {
                showAlert('Error', 'Sul pole privileege, et kuva näha');
                navigate(`/dashboard`);
            }
        };
        checkUserRights();
    }, []);

    const runJob = async () => {
        try {
            await axios.post('/api/admin/run-cron-job', { jobName: cronJob });
        } catch (_error) {
            showAlert('Error', 'Töö jooksutamine ebaõnnestus');
        }
    };

    const handleChange = (event: SelectChangeEvent) => {
        setCronJob(event.target.value as string);
    };

    return (
        <div className="flex-1">
            <p className="page-heading">Admin töölaud</p>

            <h3 className="text-secondary text-xl text-justify pb-8">Taustatööde käivitamine</h3>

            <InputLabel>Taustatöö</InputLabel>
            <Select value={cronJob} label="Taustatöö" onChange={handleChange}>
                <MenuItem value={'userSync'}>Kasutajate sünk</MenuItem>
                <MenuItem value={'sheetsSync'}>Andmete sünk</MenuItem>
                <MenuItem value={'todoNotification'}>Saada meeldetuletused</MenuItem>
                <MenuItem value={'expiredTokens'}>Kustuta aegunud tokenid</MenuItem>
            </Select>
            <Button onClick={runJob}>Käivita</Button>
            <div>
                <AdminCatList></AdminCatList>
            </div>
        </div>
    );
};

export default Admin;
