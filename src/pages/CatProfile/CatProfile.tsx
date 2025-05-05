import React from "react";
import Header from "../Header.tsx";
import Sidebar from "../Dashboard/DesktopView/Sidebar.tsx";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Cat } from "../../types/Cat.ts";
import { Button } from "@mui/material";
import HamburgerMenu from "../Dashboard/DesktopView/HamburgerMenu.tsx";

const CatProfile: React.FC = () => {
  const navigate = useNavigate();
  const [cats, setCats] = useState<Cat[]>([]);
  const [selectedCat, setSelectedCat] = useState<Cat | null>(null);
  const [showMoreInfo, setShowMoreInfo] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleEditCat = () => {
    navigate("/edit-cat");
  };

  useEffect(() => {
    const fetchCats = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/animals/cat-profile");
        const fetchedCats = response.data.catProfiles || [];

        const processedCats = fetchedCats.map((cat) => ({
          ...cat,
          primaryInfo: {
            ...cat.primaryInfo,
            //imageUrl: cat.primaryInfo.imageUrl
            imageUrl: `/Cats/ingver.png`,
          },
        }));

        setCats(processedCats);
        if (processedCats.length > 0) {
          setSelectedCat(processedCats[0]);
        }
      } catch (error) {
        console.error("Error fetching cat data:", error);
        setCats([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCats();
  }, []);

  return (
    <div className="flex flex-col w-full h-screen">
      <Header />
      <div className="flex flex-col h-[calc(100vh-129px)] md:flex-row">
        <Sidebar />
        <div className="block md:hidden w-full">
          <HamburgerMenu />
        </div>

        <main className="flex flex-col w-full md:mx-12 mb-4 flex-1">
          <section className="flex my-4 items-center">
            <h1 className="text-xl mx-4 md:text-4xl">
              Kiisude profiilid veebis
            </h1>
            <img
              loading="lazy"
              className="w-12 h-12"
              src="/welcome.svg"
              alt=""
            />
          </section>
          <p className="mt-4 mx-4 text-secondary">
            Siin näed ja saad muuta oma hoiulooma(de) kuulutus(i) catshelp.ee
            veebilehel Valimiseks klõpsa hoiulooma pildil
          </p>
          <div className="flex mx-4 flex-row flex-wrap gap-4 my-6">
            {cats.length > 0 ? (
              cats.map((cat, index) => (
                <div
                  key={index}
                  className="flex flex-col items-left text-center space-y-4 cursor-pointer"
                  onClick={() => setSelectedCat(cat)}
                >
                  {cat.primaryInfo.imageUrl ? (
                    <img
                      src={cat.primaryInfo.imageUrl}
                      alt={`${cat.primaryInfo.name}'s profile`}
                      className="w-24 h-24 object-cover rounded-full shadow-md"
                    />
                  ) : (
                    <div className="w-24 h-24 flex items-center justify-center bg-gray-200 text-gray-500 rounded-full shadow-m">
                      No Image Available
                    </div>
                  )}
                  <div className="text-lg font-bold">
                    {cat.primaryInfo.name}
                  </div>
                  {selectedCat?.primaryInfo.name === cat.primaryInfo.name && (
                    <div className="w-24 h-1 bg-teal-500 rounded-full mt-2"></div>
                  )}
                </div>
              ))
            ) : //TODO: loading animation
            loading ? (
              "Oota kuni kiisud kohale jõuavad"
            ) : (
              <p>Hetkel pole kasse.</p>
            )}
            {/* <div className="flex flex-col items-center space-y-4 text-center">
                <button
                  onClick={handleEditCat}
                  className="w-24 h-24 flex items-center justify-center bg-teal-500 text-white rounded-full shadow-md hover:bg-teal-600"
                >
                  <span className="text-4xl font-mono">+</span>
                </button>
                <div className="text-lg font-bold">Lisa uus kiisu</div>
              </div> */}
          </div>

          {selectedCat && (
            <div className="flex mx-4 my-6 flex-row border border-gray-300 p-4 rounded-md shadow">
              <div className="flex flex-col">
                <div className="flex flex-col md:flex-row  items-start">
                  <div className="flex flex-col flex-1 mr-3">
                    <div className="text-sm font-medium text-secondary text-bold">
                      PEALKIRI:
                    </div>
                    <div className="flex flex-row items-center justify-between">
                      <div className="text-xl font-bold">
                        {/* {selectedCat.primaryInfo.heading} */}
                        Triibuline Kuninganna Kusja otsib oma inimest!
                      </div>
                      <Button
                        sx={{ textTransform: "none" }}
                        onClick={handleEditCat}
                      >
                        <img
                          src="/edit.png"
                          alt="Edit"
                          className="w-5 h-5 mr-2"
                        />
                        Muuda/Lisa
                      </Button>
                    </div>
                    <div className="text-sm font-medium text-secondary text-bold my-3">
                      LOOMA KIRJELDUS:
                    </div>
                    <p className="md:text-sm leading-6 tracking-normal font-normal">
                      {/* {selectedCat.primaryInfo.description} */}
                      Tutvustame Teile Kusjat, üht elegantset ja paimaias
                      kiisut, kes on oma 1-aasta vanuses valmis leidma armastava
                      kodu. Kusja on triibuline kaunitar, keda kaunistavad
                      valged laigud, ning ta ootab Teid Põhja-Pärnumaal. See
                      rahulik ja seltsiv kass on tõeline aare neile, kes
                      hindavad mõnusat kaisukaaslast ja head seltskonda. Kusja
                      sattus meie hoole alla Audrust, kus ta leiti
                      suvilarajoonist koos oma poegadega. Juba esimesest hetkest
                      näitas Kusja, et on sõbralik ja otsib inimeste lähedust –
                      temast sai kohe suur paihuviline ja tähelepanuotsija.
                      Protseduurid ja tervis: Kusja on igati hoolitsetud – tal
                      on tehtud kiipimine, kõik vajalikud vaktsiinid, ta on
                      steriliseeritud ja saanud ussirohukuuri. Kusjal pole
                      kroonilisi haigusi ega erivajadusi. Iseloom ja harjumused:
                      Kusja on tõeline kodune aristokraat. Ta armastab
                      rahulikult voodis jalutsis magada ja on suur tähelepanu
                      nautija. Samas on ta ka empaatiline ja mõistlik – oma
                      poegi jälgib ta hoolitseva silmaga ning vajadusel kutsub
                      nad korrale. Ta harjub kiirelt uue keskkonnaga, usaldab
                      inimesi ruttu ja on peagi uues kodus justkui pereliige.
                      Kusja on loomult rahumeelne ja ei pelga lapsi, koeri ega
                      teisi kasse, kuid ei otsi ka konflikte – kõik on tema
                      jaoks lihtsalt osa maailmast, millesse ta rahulikult ja
                      väärikalt suhtub. Erilised märkused: Kusja eelistab
                      kodutoitu krõbinatele ja konservile, mistõttu tuleb tema
                      söögivalikuid hoolikalt jälgida. Kuigi ta kasutab
                      liivakasti hästi ja harjub kiirelt uue kohaga, võib ta
                      mõnikord kratsida mööblit – seega on soovitatav pakkuda
                      talle head kratsiposti. Kusja sobib nii toa- kui
                      õuekassiks ja oleks ideaalne kaaslane perele, kes hindab
                      rahulikku ja sõbralikku lemmikut. Ta on valmis pakkuma
                      rõõmu ja rahu neile, kes annavad talle uue võimaluse
                      armastavas kodus. Kui Sa tunned, et just Sina võiksid
                      pakkuda Kusjale seda turvalist ja armastavat keskkonda,
                      võta ühendust tema hoidjaga, Ene Teoriga, et saada rohkem
                      infot ja leppida kokku kohtumine! Leia endale truu sõber
                      ja toeta tema teekonda uue, armastava kodu poole!
                    </p>
                  </div>
                  <div className="flex flex-col flex-wrap ">
                    <img
                      src={`${selectedCat.primaryInfo.imageUrl}`}
                      alt={`${selectedCat.primaryInfo.imageUrl}`}
                      className="w-24 h-24 min-w-52 min-h-52 object-cover rounded-lg mb-3"
                    />

                    <div className="hidden md:block relative">
                      <img
                        src={`${selectedCat.primaryInfo.imageUrl}`}
                        alt={`${selectedCat.primaryInfo.imageUrl}`}
                        className="w-24 h-24 min-w-52 min-h-52 object-cover rounded-lg"
                      />
                      <div className="absolute inset-0 bg-white bg-opacity-60"></div>
                      <div className="absolute inset-0 flex items-center justify-center font-semibold text-xl">
                        + 7 pilti
                      </div>
                    </div>
                    <div className="block md:hidden">
                      <Button
                        sx={{
                          width: "100%",
                          height: "100%",
                          backgroundColor: "#007AFF",
                          fontSize: "13px",
                          padding: "4px 12px",
                          borderRadius: "6px",
                          textTransform: "none",
                        }}
                        onClick={() => {
                          /* TODO: open phone gallery*/
                        }}
                        variant="contained"
                      >
                        Vaata veel
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="text-sm font-medium text-secondary text-bold mt-3">
                  LOOMA PROFIIL:
                </div>
                <div className="text-sm font-bold">Kassi nimi</div>
                <div className="text-sm">{selectedCat.primaryInfo.name}</div>
                <div className="text-sm font-bold">Kassi ID</div>
                <div className="text-sm">
                  {selectedCat.primaryInfo.rescueId}
                </div>
                <div className="text-sm font-bold">Kassi asukoht</div>
                <div className="text-sm">
                  {selectedCat.primaryInfo.location}
                </div>
                <div className="text-sm font-bold">Kassi vanus/sünnikp</div>
                <div className="text-sm">
                  {selectedCat.primaryInfo.dateOfBirth}
                </div>
                <div className="text-sm font-bold">Kassi sugu</div>
                <div className="text-sm">{selectedCat.primaryInfo.gender}</div>
                {/* <div className="text-sm font-bold">Kassi vanus</div>
                <div className="text-sm">{selectedCat.primaryInfo.age}</div> */}
                <div className="text-sm font-bold">Kassi värv</div>
                <div className="text-sm">{selectedCat.primaryInfo.color}</div>
                <div className="text-sm font-bold">Kassi karva pikkus</div>
                <div className="text-sm">
                  {selectedCat.primaryInfo.furLength}
                </div>
                <div className="text-sm font-bold">Kassi päästmiskp</div>
                <div className="text-sm">
                  {selectedCat.primaryInfo.rescueDate}
                </div>
                <div className="text-sm font-bold">Kassi kiibi ID</div>
                <div className="text-sm">{selectedCat.primaryInfo.chipId}</div>
                <div className="text-sm font-bold">Lisamärkmed kassi kohta</div>
                <div className="text-sm">
                  {selectedCat.primaryInfo.additionalNotes}
                </div>

                <div className="text-sm font-bold">
                  Kui kassil esineb krooniline haigus, vajab eritoitu või on
                  vigastus siis palun kirjuta sellest siia
                </div>
                <div className="text-sm">
                  {selectedCat.moreInfo?.chronicIllnesses}
                </div>
                <div className="text-sm font-bold">
                  Kui kaua on kass hoiukodus/kassitoas viibinud?
                </div>
                <div className="text-sm">
                  {selectedCat.moreInfo?.timeInFosterCare}
                </div>
                <div className="text-sm font-bold">
                  Kas sa tead kuidas kiisu meie MTÜ hoole alla sattus?
                  (Kirjeldada tema leidmise ajalugu, mis seisundis oli jne).
                </div>
                <div className="text-sm">
                  {selectedCat.moreInfo?.rescueHistory}
                </div>
                <div className="text-sm font-bold">Iseloom</div>
                <div className="text-sm">
                  {selectedCat.moreInfo?.personality}
                </div>
                <div className="text-sm font-bold">Mis kassile meeldib:</div>
                <div className="text-sm">{selectedCat.moreInfo?.likes}</div>
                <div className="text-sm font-bold">
                  Kirjelda kassi mõne iseloomustava lausega (nt milline on kiisu
                  argipäev)
                </div>
                <div className="text-sm">
                  {selectedCat.moreInfo?.dailyRoutine}
                </div>
                <div className="text-sm font-bold">
                  Kuidas suhtub teistesse kassidesse?
                </div>
                <div className="text-sm">
                  {selectedCat.moreInfo?.interactions?.cats}
                </div>
                <div className="text-sm font-bold">
                  Kuidas suhtub koertesse?
                </div>
                <div className="text-sm">
                  {selectedCat.moreInfo?.interactions?.dogs}
                </div>
                <div className="text-sm font-bold">Kuidas suhtub lastesse?</div>
                <div className="text-sm">
                  {selectedCat.moreInfo?.interactions?.children}
                </div>
                <div className="text-sm font-bold">
                  Kas ta sobiks toa- või õuekassiks?
                </div>
                <div className="text-sm">{selectedCat.moreInfo?.type}</div>
                <div className="text-sm font-bold">
                  Kas kassil on mingeid erivajadusi?
                </div>
                <div className="text-sm">
                  {selectedCat.moreInfo?.specialNeeds}
                </div>
                <div className="text-sm font-bold">
                  Mingeid muid märkmeid või infot ?
                </div>
                <div className="text-sm">{selectedCat.moreInfo?.otherInfo}</div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default CatProfile;
