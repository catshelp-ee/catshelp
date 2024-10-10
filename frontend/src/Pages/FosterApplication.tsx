import React, { useState } from "react";
import FormInput from "../Components/Form/FormInput";
import FormRadio from "../Components/Form/FormRadio";
import "../Components/Form/form.css";

const submitForm = (e: any) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  console.log(formData);
  const payload = Object.fromEntries(formData);
  console.log(payload);
};

function FosterApplication() {
  const [questionNumber, setQuestionNumber] = useState(1);
  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-4 pb-12">
        <p>
          Aitäh, et oled otsustanud pakkuda kassidele hoiukodu ning valinud
          selleks just meie MTÜ!
        </p>

        <p>
          Cats Help on vabatahtlikest koosnev organisatsioon ennekõike kasside,
          aga ka teiste hüljatud lemmikloomade päästmiseks. Me tegutseme üle
          Eesti ja tegevust alustasime 2019. aastal. Peamiselt ootavad päästetud
          kiisud uut kodu hoiukodudes, 2021. aasta sügisel avasime Nõmmel ka
          kassitoa. Meie missiooniks on aidata loomad tänavalt ära, neid
          vajadusel ravida, steriliseerida/kastreerida, kiipida ja inimesega
          sotsialiseerida ning leida neile uued kodud.
        </p>

        <p>
          Uue hoiukoduna saad Sa endale mentori, kes on esialgu sulle toeks ja
          abiks. Sind aitab ka hoiukodudele koostatud juhend, kust leiad kogu
          esialgu vaja mineva informatsiooni kompaktselt ühest kohast. Enamik
          Cats Helpi suhtlusest toimub Discordi rakenduses, kus on mitmed
          kanalid ka hoiukodudele. Seal on võimalik suhelda MTÜ vabatahtlike ja
          teiste hoiukodudega, et saada vastused oma tekkinud küsimustele.
          Discordi kasutades ei jää sa hoiukoduna kunagi üksi ning saad mure
          korral kiiresti vastuse.
        </p>

        <p>
          Hoiukoduna on sul õigus saada Cats Helpi käest kõik kassi pidamiseks
          vajaliku: toidu, kassiliiva ja muud tarbed. Kui sul on võimalik
          hoiukodu pakkumise ajal hoiukassile aeg-ajalt toitu ja kassiliiva
          osta, siis hindame me väga sinu panust ja loeme selle sinupoolseks
          väärtuslikuks annetuseks. Kassile toidu ja liiva ostmine ei ole
          eelduseks, et saaksid kassile hoiukodu pakkuda. Kui sa otsustad toidu
          ja/või kassiliiva ise osta, saab su mentor jagada infot parimate
          ostukohtade ja sooduspakkumiste kohta.
        </p>

        <p>
          Kui sa ei oma autot, kuid sul on vaja tarvikute võtmiseks kassitoas
          või kassiga veterinaari juures käia, siis saame sind transpordiga
          abistada. Kui sul on võimalik leida endale ise sobiv transport või
          kasutada taksoteenust, siis oleme ka selle eest tänulikud.
        </p>

        <p>
          Palun täida ära allolev küsimustik, et saaksime ülevaate Sinu
          võimalustest ja vajadustest MTÜ ja kiisude abistamisel.
        </p>

        <p>
          Meie vabatahtlikud võtavad sinuga e-maili teel ühendust peale täidetud
          küsimustiku kätte saamist.
        </p>
      </div>
      <form onSubmit={submitForm} action="" className="flex flex-col">
        <FormInput
          question="Sinu nimi(ees ja perekonnanimi)"
          id="nimi"
          required
        />
        <FormInput question="Sinu vanus" id="vanus" type="number" required />
        <FormInput question="Telefoninumber" id="tel" required />
        <FormInput question="E-Post" id="epost" required />
        <FormInput
          question="Asukoht(linn/asula ja maakond)"
          id="epost"
          required
        />
        <FormRadio
          question="Missugune on Sinu eluase?"
          ids={["ko", "ri", "ersl", "ervl", "erle", "muu"]}
          name="elamine"
          answers={[
            "Korter",
            "Ridaelamu",
            "Eramu suures linnas",
            "Eramu väikeses linnas",
            "Eramu/talu, mis asub liiklusest eemal",
            "muu",
          ]}
        />
        <FormRadio
          question="Eluase on ..."
          ids={["ur", "eo", "po", "muu2"]}
          name="kodu"
          answers={["Üüripind", "Enda omanduses", "Pere omanduses", "muu"]}
        />
        <FormRadio
          question="Kas üüripinna puhul on lubatud võtta lemmikloomi/pakkuda hoiukodu"
          ids={["j", "e", "et", "pu"]}
          name="uuripind"
          answers={["Jah", "Ei", "Ei ole kindel", "Pole üüripind"]}
        />
        <FormInput
          question="Missugune on Sinu eelnev loomapidamise kogemus?"
          id="kogemus"
          required
        />
        <FormInput
          question="Kas oled varem loomale hoiukodu pakkunud? Kui jah, siis millise loomaga oli tegu? Millal ja kui kaua pakkusid hoiukodu? Millise MTÜ loomale hoiukodu pakkusid?"
          id="kokkupuude"
        />
        <FormInput
          question="Kas Sul on praegu kodus lemmikloomi? Kui jah, siis palun kirjuta nende arv. Millal on nad viimati vaktsineeritud ja mille vastu (võimalusel lisa ka vaktsiini nimi)?"
          id="loomadkodus"
          required
        />
        <FormInput
          question="Millise firma toitu plaanid oma hoiukassile pakkuda? Kas tead, kuidas erinevad loomapoodides või kliinikutes müüdavad toidud toidupoes müüdavast loomatoidust?"
          id="toit"
        />
        <FormInput
          question="Kuidas tagad hoius oleva kassi turvalisuse? Kass ei tohi aknast välja pääseda, ega jääda tuulutusasendisse jäetud akna vahele."
          id="turv"
          required
        />
        <FormInput
          question="Kas Sinu kodus on toataimi? Missugused? Kas oled teadlik, et mõned toataimed võivad söömisel põhjustada kassidel terviseprobleeme?."
          id="ohutus"
          required
        />
        <FormInput
          question="Kui peres on lapsed, siis palun pane kirja nende arv ja vanused. "
          id="lapsed"
          required
        />
        <FormRadio
          question="Kas peres on keegi, kes on kassidele allergiline?"
          ids={["jh3", "ei3", "eiki"]}
          name="auto"
          answers={["Jah", "Ei", "Ei ole kindel"]}
        />
        <FormInput
          question="Kas kõik pereliikmed teavad Sinu plaanist hoiukodu pakkuda ja on sellega nõus?"
          id="allergia"
          required
        />
        <FormRadio
          question="Kas Sul on auto kasutamise võimalus?"
          ids={["jh2", "ei2", "vajk"]}
          name="auto"
          answers={["Jah", "Ei", "Vajaduse korral"]}
        />
        <FormRadio
          question="Kas Sul on võimalik vajaduse tekkimisel külastada hoiukassiga meie koostööpartneriteks olevaid loomakliinikuid? (Tallinnas nt Haabersti ja Mustakivi Loomakliinik, Tartus Väikeloomakliinik)"
          ids={["jh", "ei"]}
          name="vajadus"
          answers={["Jah", "Ei"]}
        />
        <FormInput
          question="Kui valisid EI, siis millises kliinikus oleks Sul võimalik loomaga käia?"
          id="kohalik"
          required
        />

        <FormRadio
          question="Kui kaua oled valmis hoiukodu pakkuma?"
          ids={["ad", "bd", "muu6"]}
          name="kaua"
          answers={[
            "Kuni kassile päriskodu leidmiseni",
            "Piiratud aeg",
            "Muu: ",
          ]}
        />
        <FormInput
          question="Kui valisid eelmise küsimuse vastusena 'piiratud aeg', siis kui kaua oled valmis hoiukodu pakkuma? (Mis kuupäevani või mitu kuud/nädalat/päeva)"
          id="piiratud"
          required
        />

        <FormRadio
          question="Mida ootad hoiukodu pakkumisel MTÜ poolt? (võib märkida mitu valikut)"
          ids={["aa", "ba", "ca", "da", "ea", "fa", "muu4"]}
          answers={[
            "Soovin, et MTÜ tasuks kassi toidukulud",
            "Soovin, et MTÜ tasuks kulud kassiliiva eest",
            "Soovin, et MTÜ abistaks mind transpordiga (nt kassi vastu võtmisel või kliinikusse minemisel)",
            "Soovin, et MTÜ tasuks kassi raviarved",
            "Soovin, et MTÜ abistaks mind kassi koduotsingu kuulutuse koostamisel",
            "Soovin, et MTÜ laenaks mulle kassi hoidmiseks vajalikud vahendid (nt liivakast, sööginõud, metallpuur, transpordipuur)",
            "Muu: ",
          ]}
        />

        <FormRadio
          question="Kas oled valmis vajadusel ka muudes MTÜ tegevustes abiks olema?"
          ids={["ab", "bb", "cb", "db", "eb", "fb", "gb", "hb", "muu5"]}
          answers={[
            "Täiskasvanud kass",
            "Kassipoeg",
            "Pesakond (ema + pojad)",
            "Tiine kass",
            "Sõbralik ja terve kass",
            "Ravi vajav kass",
            "Sotsialiseerimata kass",
            "Mitu kassi",
            "Muu: ",
          ]}
        />

        <FormInput
          question="Kui jõudsid siia kodulehelt, siis kas eelistad kassitoast endale mõnda kindlat kassi, kellele hoiukodu pakkuda? (Palun kirjuta siia kassi nimi)"
          id="kodulehelt"
        />

        <FormRadio
          question="Kas oled valmis vajadusel ka muudes MTÜ tegevustes abiks olema?"
          ids={["a", "b", "c", "d", "e", "f", "g", "h", "muu3"]}
          answers={[
            "Jah, olen valmis vastama MTÜ messengeri tulevatele pöördumistele",
            "Jah, olen valmis haldama Exceli tabeleid kasside andmetega",
            "Jah, soovin kirjutada kasside koduotsingu kuulutusi",
            "Jah, saan käia kassitoas abiks",
            "Jah, saan aidata teisi hoiukodu pakkujaid või kassitoa kasse transpordiga",
            "Jah, saan aidata teisi hoiukodu pakkujaid kassidest professionaalsete piltide tegemisel",
            "Ma ei ole endale ülalolevatest sobivat ülesannet leidnud, aga olen valmis MTÜ tegevustes kaasa aitama",
            "Ma ei soovi hetkel MTÜ tegevustes teistmoodi kaasa aidata",
            "Muu: ",
          ]}
        />
        <button type="submit">SUBMIT</button>
      </form>
    </div>
  );
}

export default FosterApplication;
