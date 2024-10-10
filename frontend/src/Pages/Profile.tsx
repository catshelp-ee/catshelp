import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Button, Input } from "@mui/material";
import * as Utils from "../Utils";
import EditableInput from "../Components/EditableInput";
import ImageGallery from "react-image-gallery";

function Profile() {
  const location = useLocation();
  const catNameFromURL: string = Utils.getCatNameFromURL(location.pathname);
  const [imageOfCat, setImageOfCat] = useState<any>();
  const [images, setImages] = useState<any>([]);
  const [catInfo, setCatInfo] = useState<any>();
  const [infoIsEditable, setInfoIsEditable] = useState<boolean>(false);
  const [files, setFiles] = useState<any>([]);
  const [update, setUpdate] = useState(false);
  useEffect(() => {
    const fetchAll = async () => {
      try {
        Utils.getImages(catNameFromURL).then((images: any) => {
          const temp: any[] = [];
          images.data.forEach((element: any) => {
            temp.push({
              original: element,
              thumbnail: element,
            });
          });
          setImages(temp);
        });
        Utils.getProfileInfo(catNameFromURL).then((data) => {
          setCatInfo(data.data[0]);
        });
      } catch (error) {
        console.log(error);
      }
    };
    fetchAll();

    return () => {};
  }, []);

  useEffect(() => {
    Utils.getImages(catNameFromURL).then((images: any) => {
      const temp: any[] = [];
      images.data.forEach((element: any) => {
        temp.push({
          original: element,
          thumbnail: element,
        });
      });
      setImages(temp);
    });
    return () => {};
  }, [update]);

  const editInfoOrSubmitForm = (e: any) => {
    e.preventDefault();

    if (!infoIsEditable) {
      setInfoIsEditable(true);
      return;
    }

    const formData = new FormData(e.target);
    const payload = Object.fromEntries(formData);
    //console.log(catInfo[Object.keys(payload)[0]]);
    Utils.changeInfo(payload);
    setInfoIsEditable(false);
  };

  return (
    <div className="w-full h-full flex">
      <img src={imageOfCat} alt="" />
      <ImageGallery items={images} />
      <div className="flex flex-col">
        {catInfo ? (
          <form onSubmit={editInfoOrSubmitForm}>
            <EditableInput disabled={!infoIsEditable} label="Nimi" name="nimi">
              {catInfo.nimi}
            </EditableInput>
            <EditableInput
              disabled={!infoIsEditable}
              label="Vanus"
              name="synniaeg"
            >
              {Utils.getAge(catInfo.synniaeg)}
            </EditableInput>
            <EditableInput
              disabled={!infoIsEditable}
              label="Järgmise vaktsiini aeg"
              name="jargmine_kompleksvaktsiin"
            >
              {Utils.dateToWords(
                catInfo.jargmine_kompleksvaktsiin.split("T")[0]
              )}
            </EditableInput>
            <EditableInput
              disabled={!infoIsEditable}
              label="Järgmise marutaudi aeg"
              name="jargmine_marutaudivaktsiin"
            >
              {Utils.dateToWords(
                catInfo.jargmine_marutaudivaktsiin.split("T")[0]
              )}
            </EditableInput>
            <EditableInput
              disabled={!infoIsEditable}
              label="Kiibi number"
              name="kiibi_nr"
            >
              {Utils.formatChipNumber(catInfo.kiibi_nr)}
            </EditableInput>
            <EditableInput disabled={!infoIsEditable} label="Värv" name="varv">
              {catInfo.varv}
            </EditableInput>
            <EditableInput
              disabled={!infoIsEditable}
              label="Karva pikkus"
              name="karva_pikkus"
            >
              {catInfo.karva_pikkus}
            </EditableInput>
            <EditableInput
              disabled={!infoIsEditable}
              label="Täiendavad märkmed"
              name="lisa"
            >
              {catInfo.lisa}
            </EditableInput>
            <EditableInput disabled={!infoIsEditable} label="Muu" name="muu">
              {catInfo.muu}
            </EditableInput>
            <Button type="submit">muuda</Button>
            <input
              type="file"
              multiple
              onChange={(e: any) =>
                setFiles(Array.from(e.target.files) as File[])
              }
            />
            <Button
              onClick={() => {
                setUpdate((prev) => !prev);
                Utils.uploadImages(files, catInfo.nimi);
              }}
            >
              Upload
            </Button>
          </form>
        ) : (
          <></>
        )}
        <div className="p-12">
          <h1 className="text-4xl">TEADETE TAHVEL</h1>
          <ul className="list-disc">
            <li>Teade1</li>
            <li>Teade2</li>
            <li>Teade3</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

/*
            <div>Hoiukodu: {catInfo["_HOIUKODU/ KLIINIKU NIMI"]}</div>
            <div>Asukoht: {catInfo["ASUKOHT"]}</div>
*/

export default Profile;
