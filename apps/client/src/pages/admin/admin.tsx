import { useAlert } from "@context/alert-context";
import { useAuth } from "@context/auth-context";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";

interface AdminProps { }

const Admin: React.FC<AdminProps> = () => {
    const { getUser } = useAuth();
    const { showAlert } = useAlert();
    const navigate = useNavigate();

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

    const runJob = async (jobName) => {
        try {
            await axios.post('/api/admin/run-cron-job', { jobName: jobName });
        } catch (error) {
            showAlert('Error', 'Töö jooksutamine ebaõnnestus');
        }
    }

    return (
        <div className="md:mx-12 flex-1">
            <h1 className="text-2xl text-center md:text-left">
                Admin töölaud
            </h1>

            <h3>Taustatööde käivitamine</h3>
            <span>Kasutajate sünk</span>
            <Button onClick={(e) => runJob('userSync')}>
                Käivita
            </Button>
        </div>
    );
};

export default Admin;