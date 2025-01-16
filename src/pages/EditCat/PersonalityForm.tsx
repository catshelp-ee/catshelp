import React from "react";
import {
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Checkbox,
  Typography,
  ListItemText,
} from "@mui/material";

interface PersonalityFormProps {
  formData: any;
  setFormData: (data: any) => void;
}

const personalities = [
  "Julge",
  "Arg",
  "Aktiivne",
  "Väga aktiivne",
  "Rahulik",
  "Sõbralik",
  "Pahur",
  "Hellik",
  "Ei lase puudutada ennast",
  "Seltsiv",
  "Omaette hoidev",
  "Hea isuga",
  "Uudishimulik",
  "Mänguline",
  "Stressis",
  "Õrnahingeline",
  "Rahumeelne",
  "Isekas",
  "Sisiseb palju",
];

const likes = [
  "Süles olla",
  "Kaisus magada",
  "Pai saada",
  "Palju tähelepanu",
  "Mängida mänguasjadega inimesega",
  "Mängida mänguasjadega üksinda",
];

const otherTraits = [
  "Kasutab liivakasti hästi",
  "Kasutab kratsimispuud hästi",
  "On valikuline toiduga, pirtsutab",
  "Harjub kiirelt uue kohaga",
  "Kipub kratsima muud mööblit",
  "Usaldab inimesi kiiresti",
];

const interactionsWithCats = [
  "Meeldivad väga, vajab kindlasti kõrvale kassi",
  "Meeldivad",
  "Neutraalselt",
  "Umbusklik",
  "Ei meeldi",
  "Ei ole tutvunud teiste kassidega",
  "Peab olema ainus kass peres",
];

const interactionsWithDogs = [
  "Jumaldab koeri, tahaks väga koertega koju saada",
  "Saab koertega hästi läbi",
  "Neutraalselt",
  "Umbusklik",
  "Ei meeldi",
  "Pole tutvunud",
];

const interactionsWithChildren = [
  "Hästi",
  "Neutraalselt",
  "Umbusklik",
  "Ei sobi lastega",
  "Ei ole kohanud lapsi, ei tea",
];

const catTypes = ["Toakassiks", "Õuekassiks", "Toa- ja õuekassiks"];

export const PersonalityForm: React.FC<PersonalityFormProps> = ({
  formData,
  setFormData,
}) => {
  const handleMultiSelectChange = (field: string, value: string[]) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="flex flex-col gap-4">
      <FormControl component="fieldset">
        <Typography variant="subtitle2">
          Kassi iseloom, vali sobivad lahtrid
        </Typography>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={formData.personality || []}
          onChange={(e) =>
            handleMultiSelectChange(
              "personality",
              typeof e.target.value === "string"
                ? e.target.value.split(",")
                : e.target.value
            )
          }
          renderValue={(selected) => (selected as string[]).join(", ")}
        >
          {personalities.map((personality) => (
            <MenuItem key={personality} value={personality}>
              <Checkbox
                checked={(formData.personality || []).includes(personality)}
              />
              <ListItemText primary={personality} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl component="fieldset">
        <Typography variant="subtitle2">Kas kassile meeldib?</Typography>
        <Select
          multiple
          value={formData.likes || []}
          onChange={(e) =>
            handleMultiSelectChange(
              "likes",
              typeof e.target.value === "string"
                ? e.target.value.split(",")
                : e.target.value
            )
          }
          renderValue={(selected) => (selected as string[]).join(", ")}
        >
          {likes.map((like) => (
            <MenuItem key={like} value={like}>
              <Checkbox checked={(formData.likes || []).includes(like)} />
              <ListItemText primary={like} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl component="fieldset">
        <legend>Kass</legend>
        <Select
          multiple
          value={formData.otherTraits || []}
          onChange={(e) =>
            handleMultiSelectChange(
              "otherTraits",
              typeof e.target.value === "string"
                ? e.target.value.split(",")
                : e.target.value
            )
          }
          renderValue={(selected) => (selected as string[]).join(", ")}
        >
          {otherTraits.map((trait) => (
            <MenuItem key={trait} value={trait}>
              <Checkbox
                checked={(formData.otherTraits || []).includes(trait)}
              />
              <ListItemText primary={trait} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        name="dailyRoutine"
        label="Kassi argipäev"
        value={formData.dailyRoutine}
        onChange={handleChange}
        fullWidth
        multiline
        rows={3}
        helperText="Kirjelda kassi mõne iseloomustava lausega(nt milline on kiisu argipäev"
      />

      <FormControl>
        <InputLabel>Kuidas suhtub teistesse kassidesse?</InputLabel>
        <Select
          value={formData.interactionWithCats || ""}
          onChange={(e) =>
            setFormData({ ...formData, interactionWithCats: e.target.value })
          }
        >
          {interactionsWithCats.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl>
        <InputLabel>Kuidas suhtub koertesse?</InputLabel>
        <Select
          value={formData.interactionWithDogs || ""}
          onChange={(e) =>
            setFormData({ ...formData, interactionWithDogs: e.target.value })
          }
        >
          {interactionsWithDogs.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl>
        <InputLabel>Kuidas suhtub lastesse?</InputLabel>
        <Select
          value={formData.interactionWithChildren || ""}
          onChange={(e) =>
            setFormData({
              ...formData,
              interactionWithChildren: e.target.value,
            })
          }
        >
          {interactionsWithChildren.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth>
        <InputLabel>Kas ta sobiks toa- või õuekassiks?</InputLabel>
        <Select
          value={formData.type || ""}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
        >
          {catTypes.map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};
