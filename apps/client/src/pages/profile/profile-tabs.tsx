import { Profile, ProfileHeader } from "@catshelp/types/src";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAlert } from "@context/alert-context";

interface TabProps {
    cats: ProfileHeader[];
    setSelectedCat: React.Dispatch<React.SetStateAction<Profile>>;
}

const ProfileTab: React.FC<TabProps> = ({
    cats,
    setSelectedCat
}) => {
      const getTabFromURL = () => {
          const params = new URLSearchParams(window.location.search);
          const tab = params.get('cat');
          for (let i = 0; i < cats.length; i++) {
              if (cats[i].id.toString() == tab) {
                  return cats[i].id;
              }
          }
          return cats[0].id;
      };

    const [activeTab, setActiveTab] = useState(getTabFromURL());
    const { showAlert } = useAlert();

    const setInitialTab = () => {
        const url = new URL(window.location.toString());
        url.searchParams.set('cat', activeTab.toString());
        window.history.replaceState({}, '', url);
    }

    // Update URL when tab changes
    const handleTabChange = (tab) => {
        setActiveTab(tab.id);
        const url = new URL(window.location.toString());
        url.searchParams.set('cat', tab.id);
        window.history.pushState({}, '', url);
    };

    // Listen for browser back/forward navigation
    useEffect(() => {
        const handlePopState = () => {
            setActiveTab(getTabFromURL());
        };

        const loadCat = async () => {
            try {
                const response = await axios.get("/api/animals/" + activeTab + "/profile", {
                    withCredentials: true
                });

                const catProfile = response.data;
                setSelectedCat(catProfile);
            } catch (error) {
                console.error("Error loading cat profiles:", error);
                showAlert("Error", "Kassi andmete pärimine ebaõnnestus");
                setSelectedCat(null);
            }
        };

        loadCat();
        setInitialTab();
        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, [activeTab]);

    return (
        <div className="profile-tab-container">
            <div className="flex">
                {cats.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => handleTabChange(tab)}
                        className={`profile-tab ${activeTab === tab.id ? 'profile-tab-active' : ''}`}>
                        {tab.name}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ProfileTab;
