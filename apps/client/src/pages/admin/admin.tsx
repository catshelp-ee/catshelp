import { useAlert } from "@context/alert-context";
import { useAuth } from "@context/auth-context";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Select, MenuItem, InputLabel, SelectChangeEvent } from "@mui/material";

interface AdminProps { }

const Admin: React.FC<AdminProps> = () => {
    const { getUser } = useAuth();
    const { showAlert } = useAlert();
    const navigate = useNavigate();
    const [cronJob, setCronJob] = useState('');

    useEffect(() => {
        const checkUserRights = async () => {
            try {
                const user = await getUser();
                if (user.role !== 'ADMIN') {
                    showAlert('Error', "Sul pole privileege, et kuva näha");
                    navigate(`/dashboard`);
                }
            } catch (error) {
                showAlert('Error', "Sul pole privileege, et kuva näha");
                navigate(`/dashboard`);
            }
        }
        checkUserRights();
    }, []);

    const runJob = async () => {
        try {
            await axios.post('/api/admin/run-cron-job', { jobName: cronJob });
        } catch (error) {
            showAlert('Error', 'Töö jooksutamine ebaõnnestus');
        }
    }

    const handleChange = (event: SelectChangeEvent) => {
        setCronJob(event.target.value as string);
    };

    return (
        <div className="md:mx-12 flex-1">
            <p className="page-heading">
                Admin töölaud
            </p>

            <h3 className="text-secondary text-xl text-justify pb-8">Taustatööde käivitamine</h3>

            <InputLabel>Taustatöö</InputLabel>
            <Select
                value={cronJob}
                label="Taustatöö"
                onChange={handleChange}
            >
                <MenuItem value={"userSync"}>Kasutajate sünk</MenuItem>
                <MenuItem value={"sheetsSync"}>Andmete sünk</MenuItem>
                <MenuItem value={"todoNotification"}>Saada meeldetuletused</MenuItem>
                <MenuItem value={"expiredTokens"}>Kustuta aegunud tokenid</MenuItem>
            </Select>
            <Button onClick={(e) => runJob()}>
                Käivita
            </Button>
        </div>
    );
};

export default Admin;