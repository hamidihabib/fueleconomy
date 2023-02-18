'use client'

import styles from "../styles/Home.module.scss";
import { useEffect, useRef, useState } from "react";
import useData from "./useData.json";

const url = "https://www.fueleconomy.gov/ws/rest/ympg/shared/";
const make = url + "menu/make";
const model = url + "menu/model?make=";
const options = { headers:  {Accept: "application/json" } };

async function getVehicles() {
  return await (await fetch(make, options)).json();
}
async function getModel(modelName: any) {
  return await (await fetch(model + modelName, options)).json();
}
async function getAllVehicleData(make: string, model: string) {
  return await (
    await fetch(url + "vehicles?make=" + make + "&model=" + model, options)
  ).json();
}

export default function Home() {
  const formRef: any = useRef();
  const [width, setWidth] = useState(300);

  const [makeData, setMakeData] = useState([]);
  const [modelData, setModelData] = useState([]);
  const [yearData, setYearData] = useState([]);
  const [allDataInfo, setAllDataInfo] = useState(useData);

  const [makeInputData, setMakeInputData] = useState("");
  const [modelInputData, setModelInputData] = useState("");
  const [yearInputData, setYearInputData] = useState("");

  const [display, setDisplay] = useState({
    make: false,
    model: false,
    year: false,
  });
  const [Logic, setLogic] = useState({
    make: false,
    model: false,
    year: false,
  });

  function filter(data: any, keyword: string, item: string) {
    return data.filter((i: any) => i[item].match(new RegExp(keyword, "i")));
  }  

  const makeDataNew = Array.isArray(makeData) ? makeData : [makeData];
  const modelDataNew = Array.isArray(modelData) ? modelData : [modelData];
  const yearDataNew = Array.isArray(yearData) ? yearData : [yearData];

  const makeFilter = filter(makeDataNew, makeInputData, "text");
  const modelFilter = filter(modelDataNew, modelInputData, "text");
  const yearFilter = filter(yearDataNew, yearInputData, "year");

  useEffect(() => {
    function handleChange() {
      setWidth(formRef.current.offsetWidth);
    }
    handleChange();
    addEventListener("keydown", handleChange);
    getVehicles().then((e) => setMakeData(e?.menuItem));
    if (Logic.make == true) {
      getModel(makeInputData).then((e) => setModelData(e?.menuItem));
    }
    if (Logic.make && Logic.model) {
      getAllVehicleData(makeInputData, modelInputData).then((e) =>
        setYearData(e?.vehicle)
      );
    }
  }, [formRef, Logic, makeInputData, modelInputData]);

  const allLogic = Logic.make && Logic.model && Logic.year ? true : false;

  return (
    <div className={styles.main}>

   
    <div className={styles.container}>
      {/* ////////////////////  Model  /////////////////// */}
      <div ref={formRef} className={styles.form}>
        <h3>Make</h3>
        <div className={styles.input}>
          <input
            value={makeInputData}
            type="text"
            placeholder="Make"
            onChange={(e) => setMakeInputData(e.target.value)}
            onFocus={() => {
              setDisplay({
                make: true,
                model: false,
                year: false,
              }),
                setLogic({
                  make: false,
                  model: false,
                  year: false,
                });
                setModelData([]);
                setYearData([]);
              setModelInputData("");
              setYearInputData("");
            }}
          />
          <p>&#9660;</p>
        </div>
        <ul
          style={{
            width: width,
            display: !display.make || makeFilter == 0 ? "none" : "",
          }}
        >
          {makeFilter?.map((i: any) => (
            <li
              onClick={() => {
                setMakeInputData(i.value),
                  setDisplay({
                    make: false,
                    model: false,
                    year: false,
                  }),
                  setLogic({
                    make: true,
                    model: false,
                    year: false,
                  });
                setModelInputData("");
              }}
              key={i.text}
            >
              {i.text}
            </li>
          ))}
        </ul>
      </div>

      {/* ////////////////////  Model  /////////////////// */}
      <div ref={formRef} className={styles.form}>
        <h3>Model</h3>
        <div className={styles.input}>
          <input
            value={modelInputData}
            type="text"
            placeholder="Model"
            onChange={(e) => setModelInputData(e.target.value)}
            onFocus={() => {
              setDisplay({
                make: false,
                model: true,
                year: false,
              });
              setLogic({
                make: true,
                model: false,
                year: false,
              });
              setYearData([]);
              setYearInputData("");
            }}
          />
          <p>&#9660;</p>
        </div>
        <ul
          style={{
            width: width,
            display: !display.model || modelFilter == 0 ? "none" : "",
          }}
        >
          {modelFilter?.map((i: any) => (
            <li
              onClick={() => {
                setModelInputData(i.value),
                  setDisplay({
                    make: false,
                    model: false,
                    year: false,
                  }),
                  setLogic({
                    make: true,
                    model: true,
                    year: false,
                  });
              }}
              key={i.text}
            >
              {i.text}
            </li>
          ))}
        </ul>
      </div>
      {/* ////////////////////  Year  /////////////////// */}
      <div ref={formRef} className={styles.form}>
        <h3>Year</h3>
        <div className={styles.input}>
          <input
            value={yearInputData}
            type="text"
            placeholder="year"
            onChange={(e) => setYearInputData(e.target.value)}
            onFocus={() =>
              setDisplay({
                make: false,
                model: false,
                year: true,
              })
            }
          />
          <p>&#9660;</p>
        </div>
        <ul
          style={{
            width: width,
            display: !display.year || yearFilter == 0 ? "none" : "",
          }}
        >
          {yearFilter?.map((i: any) => (
            <li
              onClick={() => {
                setYearInputData(i.year),
                  setDisplay({
                    make: false,
                    model: false,
                    year: false,
                  }),
                  setLogic({
                    make: true,
                    model: true,
                    year: true,
                  });
                setAllDataInfo(i);
              }}
              key={i.id}
            >
              {i.year} {}
            </li>
          ))}
        </ul>
      </div>

      <div
      className={styles.all_info}
       style={{
          display: allLogic ? "block" : "none",
        }} 
      >
        {/* /////// I'm sorry I didn't have time to minimise this text ///////// */}
        <ul >
            <li style={{display: allDataInfo.atvType==""?"none":"block"}}>▸ type of alternative fuel or advanced technology vehicle <span>{allDataInfo.atvType}</span></li>
            <li style={{display: allDataInfo.barrels08==""?"none":"block"}}>▸ annual petroleum consumption in barrels for fuelType1  <span>{allDataInfo.barrels08}</span></li>
            <li style={{display: allDataInfo.barrelsA08==""?"none":"block"}}>▸ annual petroleum consumption in barrels for fuelType2  <span>{allDataInfo.barrelsA08}</span></li>
            <li style={{display: allDataInfo.c240Dscr==""?"none":"block"}}>▸ electric vehicle charger description <span>{allDataInfo.c240Dscr}</span></li>
            <li style={{display: allDataInfo.c240bDscr==""?"none":"block"}}>▸ electric vehicle alternate charger description <span>{allDataInfo.c240bDscr}</span></li>
            <li style={{display: allDataInfo.charge120==""?"none":"block"}}>▸ time to charge an electric vehicle in hours at 120 V <span>{allDataInfo.charge120}</span></li>
            <li style={{display: allDataInfo.charge240==""?"none":"block"}}>▸ time to charge an electric vehicle in hours at 240 V <span>{allDataInfo.charge240}</span></li>
            <li style={{display: allDataInfo.charge240b==""?"none":"block"}}>▸ time to charge an electric vehicle in hours at 240 V using the alternate charger <span>{allDataInfo.charge240b}</span></li>
            <li style={{display: allDataInfo.city08==""?"none":"block"}}>▸ city MPG for fuelType1 ,  <span>{allDataInfo.city08}</span></li>
            <li style={{display: allDataInfo.city08U==""?"none":"block"}}>▸ unrounded city MPG for fuelType1 ,  <span>{allDataInfo.city08U}</span></li>
            <li style={{display: allDataInfo.cityA08==""?"none":"block"}}>▸ city MPG for fuelType2  <span>{allDataInfo.cityA08}</span></li>
            <li style={{display: allDataInfo.cityA08U==""?"none":"block"}}>▸ unrounded city MPG for fuelType2 ,  <span>{allDataInfo.cityA08U}</span></li>
            <li style={{display: allDataInfo.cityCD==""?"none":"block"}}>▸ city gasoline consumption (gallons/100 miles) in charge depleting mode (4) <span>{allDataInfo.cityCD}</span></li>
            <li style={{display: allDataInfo.cityE==""?"none":"block"}}>▸ city electricity consumption in kw-hrs/100 miles <span>{allDataInfo.cityE}</span></li>
            <li style={{display: allDataInfo.cityUF==""?"none":"block"}}>▸ EPA city utility factor (share of electricity) for PHEV <span>{allDataInfo.cityUF}</span></li>
            <li style={{display: allDataInfo.co2==""?"none":"block"}}>▸ tailpipe CO2 in grams/mile for fuelType1  <span>{allDataInfo.co2}</span></li>
            <li style={{display: allDataInfo.co2A==""?"none":"block"}}>▸ tailpipe CO2 in grams/mile for fuelType2  <span>{allDataInfo.co2A}</span></li>
            <li style={{display: allDataInfo.co2TailpipeAGpm==""?"none":"block"}}>▸ tailpipe CO2 in grams/mile for fuelType2  <span>{allDataInfo.co2TailpipeAGpm}</span></li>
            <li style={{display: allDataInfo.co2TailpipeGpm==""?"none":"block"}}>▸ tailpipe CO2 in grams/mile for fuelType1  <span>{allDataInfo.co2TailpipeGpm}</span></li>
            <li style={{display: allDataInfo.comb08==""?"none":"block"}}>▸ combined MPG for fuelType1 ,  <span>{allDataInfo.comb08}</span></li>
            <li style={{display: allDataInfo.comb08U==""?"none":"block"}}>▸ unrounded combined MPG for fuelType1 ,  <span>{allDataInfo.comb08U}</span></li>
            <li style={{display: allDataInfo.combA08==""?"none":"block"}}>▸ combined MPG for fuelType2  <span>{allDataInfo.combA08}</span></li>
            <li style={{display: allDataInfo.combA08U==""?"none":"block"}}>▸ unrounded combined MPG for fuelType2 ,  <span>{allDataInfo.combA08U}</span></li>
            <li style={{display: allDataInfo.combE==""?"none":"block"}}>▸ combined electricity consumption in kw-hrs/100 miles <span>{allDataInfo.combE}</span></li>
            <li style={{display: allDataInfo.combinedCD==""?"none":"block"}}>▸ combined gasoline consumption (gallons/100 miles) in charge depleting mode (4) <span>{allDataInfo.combinedCD}</span></li>
            <li style={{display: allDataInfo.combinedUF==""?"none":"block"}}>▸ EPA combined utility factor (share of electricity) for PHEV <span>{allDataInfo.combinedUF}</span></li>
            <li style={{display: allDataInfo.createdOn==""?"none":"block"}}>▸ date the vehicle record was created (ISO 8601 format) <span>{allDataInfo.createdOn}</span></li>
            <li style={{display: allDataInfo.cylinders==""?"none":"block"}}>▸ engine cylinders <span>{allDataInfo.cylinders}</span></li>
            <li style={{display: allDataInfo.displ==""?"none":"block"}}>▸ engine displacement in liters <span>{allDataInfo.displ}</span></li>
            <li style={{display: allDataInfo.drive==""?"none":"block"}}>▸ drive axle type <span>{allDataInfo.drive}</span></li>
            <li style={{display: allDataInfo.engId==""?"none":"block"}}>▸ EPA model type index <span>{allDataInfo.engId}</span></li>
            <li style={{display: allDataInfo.eng_dscr==""?"none":"block"}}>▸ engine descriptor <span>{allDataInfo.eng_dscr}</span></li>
            <li style={{display: allDataInfo.evMotor==""?"none":"block"}}>▸ electric motor (kw-hrs) <span>{allDataInfo.evMotor}</span></li>
            <li style={{display: allDataInfo.feScore==""?"none":"block"}}>▸ EPA Fuel Economy Score (-1 = Not available) <span>{allDataInfo.feScore}</span></li>
            <li style={{display: allDataInfo.fuelCost08==""?"none":"block"}}>▸ annual fuel cost for fuelType1 ($)  <span>{allDataInfo.fuelCost08}</span></li>
            <li style={{display: allDataInfo.fuelCostA08==""?"none":"block"}}>▸ annual fuel cost for fuelType2 ($)  <span>{allDataInfo.fuelCostA08}</span></li>
            <li style={{display: allDataInfo.fuelType==""?"none":"block"}}>▸ fuel type with fuelType1 and fuelType2 (if applicable) <span>{allDataInfo.fuelType}</span></li>
            <li style={{display: allDataInfo.fuelType1==""?"none":"block"}}>▸ fuel type 1. For single fuel vehicles, this will be the only fuel. For dual fuel vehicles, this will be the conventional fuel. <span>{allDataInfo.fuelType1}</span></li>
            <li style={{display: allDataInfo.fuelType2==""?"none":"block"}}>▸ fuel type 2. For dual fuel vehicles, this will be the alternative fuel (e.g. E85, Electricity, CNG, LPG). For single fuel vehicles, this field is not used <span>{allDataInfo.fuelType2}</span></li>
            <li style={{display: allDataInfo.ghgScore==""?"none":"block"}}>▸ EPA GHG score (-1 = Not available) <span>{allDataInfo.ghgScore}</span></li>
            <li style={{display: allDataInfo.ghgScoreA==""?"none":"block"}}>▸ EPA GHG score for dual fuel vehicle running on the alternative fuel (-1 = Not available) <span>{allDataInfo.ghgScoreA}</span></li>
            <li style={{display: allDataInfo.guzzler==""?"none":"block"}}>▸ if G or T, this vehicle is subject to the gas guzzler tax <span>{allDataInfo.guzzler}</span></li>
            <li style={{display: allDataInfo.highway08==""?"none":"block"}}>▸ highway MPG for fuelType1 ,  <span>{allDataInfo.highway08}</span></li>
            <li style={{display: allDataInfo.highway08U==""?"none":"block"}}>▸ unrounded highway MPG for fuelType1 ,  <span>{allDataInfo.highway08U}</span></li>
            <li style={{display: allDataInfo.highwayA08==""?"none":"block"}}>▸ highway MPG for fuelType2  <span>{allDataInfo.highwayA08}</span></li>
            <li style={{display: allDataInfo.highwayA08U==""?"none":"block"}}>▸ unrounded highway MPG for fuelType2 , <span>{allDataInfo.highwayA08U}</span></li>
            <li style={{display: allDataInfo.highwayCD==""?"none":"block"}}>▸ highway gasoline consumption (gallons/100miles) in charge depleting mode (4) <span>{allDataInfo.highwayCD}</span></li>
            <li style={{display: allDataInfo.highwayE==""?"none":"block"}}>▸ highway electricity consumption in kw-hrs/100 miles <span>{allDataInfo.highwayE}</span></li>
            <li style={{display: allDataInfo.highwayUF==""?"none":"block"}}>▸ EPA highway utility factor (share of electricity) for PHEV <span>{allDataInfo.highwayUF}</span></li>
            <li style={{display: allDataInfo.hlv==""?"none":"block"}}>▸ hatchback luggage volume (cubic feet)  <span>{allDataInfo.hlv}</span></li>
            <li style={{display: allDataInfo.hpv==""?"none":"block"}}>▸ hatchback passenger volume (cubic feet)  <span>{allDataInfo.hpv}</span></li>
            <li style={{display: allDataInfo.id==""?"none":"block"}}>▸ vehicle record id <span>{allDataInfo.id}</span></li>
            <li style={{display: allDataInfo.lv2==""?"none":"block"}}>▸ 2 door luggage volume (cubic feet)  <span>{allDataInfo.lv2}</span></li>
            <li style={{display: allDataInfo.lv4==""?"none":"block"}}>▸ 4 door luggage volume (cubic feet)  <span>{allDataInfo.lv4}</span></li>
            <li style={{display: allDataInfo.make==""?"none":"block"}}>▸ manufacturer (division) <span>{allDataInfo.make}</span></li>
            <li style={{display: allDataInfo.mfrCode==""?"none":"block"}}>▸ 3-character manufacturer code <span>{allDataInfo.mfrCode}</span></li>
            <li style={{display: allDataInfo.model==""?"none":"block"}}>▸ model name (carline) <span>{allDataInfo.model}</span></li>
            <li style={{display: allDataInfo.modifiedOn==""?"none":"block"}}>▸ date the vehicle record was last modified (ISO 8601 format) <span>{allDataInfo.modifiedOn}</span></li>
            <li style={{display: allDataInfo.mpgData==""?"none":"block"}}>▸ has My MPG data; see yourMpgVehicle and yourMpgDriverVehicle <span>{allDataInfo.mpgData}</span></li>
            <li style={{display: allDataInfo.mpgRevised==""?"none":"block"}}>▸ MPG Revised <span>{allDataInfo.mpgRevised}</span></li>
            <li style={{display: allDataInfo.phevBlended==""?"none":"block"}}>▸ if true, this vehicle operates on a blend of gasoline and electricity in charge depleting mode <span>{allDataInfo.phevBlended}</span></li>
            <li style={{display: allDataInfo.phevCity==""?"none":"block"}}>▸ EPA composite gasoline-electricity city MPGe for plug-in hybrid vehicles <span>{allDataInfo.phevCity}</span></li>
            <li style={{display: allDataInfo.phevComb==""?"none":"block"}}>▸ EPA composite gasoline-electricity combined city-highway MPGe for plug-in hybrid vehicles <span>{allDataInfo.phevComb}</span></li>
            <li style={{display: allDataInfo.phevHwy==""?"none":"block"}}>▸ EPA composite gasoline-electricity highway MPGe for plug-in hybrid vehicles <span>{allDataInfo.phevHwy}</span></li>
            <li style={{display: allDataInfo.pv2==""?"none":"block"}}>▸ 2-door passenger volume (cubic feet)  <span>{allDataInfo.pv2}</span></li>
            <li style={{display: allDataInfo.pv4==""?"none":"block"}}>▸ 4-door passenger volume (cubic feet)  <span>{allDataInfo.pv4}</span></li>
            <li style={{display: allDataInfo.range==""?"none":"block"}}>▸ EPA range for fuelType1 <span>{allDataInfo.range}</span></li>
            <li style={{display: allDataInfo.rangeA==""?"none":"block"}}>▸ EPA range for fuelType2 <span>{allDataInfo.rangeA}</span></li>
            <li style={{display: allDataInfo.rangeCity==""?"none":"block"}}>▸ EPA city range for fuelType1 <span>{allDataInfo.rangeCity}</span></li>
            <li style={{display: allDataInfo.rangeCityA==""?"none":"block"}}>▸ EPA city range for fuelType2 <span>{allDataInfo.rangeCityA}</span></li>
            <li style={{display: allDataInfo.rangeHwy==""?"none":"block"}}>▸ EPA highway range for fuelType1 <span>{allDataInfo.rangeHwy}</span></li>
            <li style={{display: allDataInfo.rangeHwyA==""?"none":"block"}}>▸ EPA highway range for fuelType2 <span>{allDataInfo.rangeHwyA}</span></li>
            <li style={{display: allDataInfo.startStop==""?"none":"block"}}>▸ vehicle has stop-start technology (Y, N, or blank for older vehicles) <span>{allDataInfo.startStop}</span></li>
            <li style={{display: allDataInfo.trans_dscr==""?"none":"block"}}>▸ transmission descriptor <span>{allDataInfo.trans_dscr}</span></li>
            <li style={{display: allDataInfo.trany==""?"none":"block"}}>▸ transmission <span>{allDataInfo.trany}</span></li>
            <li style={{display: allDataInfo.UCity==""?"none":"block"}}>▸ unadjusted city MPG for fuelType1; see the description of the EPA test procedures <span>{allDataInfo.UCity}</span></li>
            <li style={{display: allDataInfo.UCityA==""?"none":"block"}}>▸ unadjusted city MPG for fuelType2; see the description of the EPA test procedures <span>{allDataInfo.UCityA}</span></li>
            <li style={{display: allDataInfo.UHighway==""?"none":"block"}}>▸ unadjusted highway MPG for fuelType1; see the description of the EPA test procedures <span>{allDataInfo.UHighway}</span></li>
            <li style={{display: allDataInfo.UHighwayA==""?"none":"block"}}>▸ unadjusted highway MPG for fuelType2; see the description of the EPA test procedures <span>{allDataInfo.UHighwayA}</span></li>
            <li style={{display: allDataInfo.VClass==""?"none":"block"}}>▸ EPA vehicle size class <span>{allDataInfo.VClass}</span></li>
            <li style={{display: allDataInfo.year==""?"none":"block"}}>▸ model year <span>{allDataInfo.year}</span></li>
            <li style={{display: allDataInfo.youSaveSpend==""?"none":"block"}}>▸ you save/spend over 5 years compared to an average car ($). Savings are positive; a greater amount spent yields a negative number. For dual fuel vehicles, this is the cost savings for gasoline <span>{allDataInfo.youSaveSpend}</span></li>
            <li style={{display: allDataInfo.baseModel==""?"none":"block"}}>▸ base model name <span>{allDataInfo.baseModel}</span></li>
            <li style={{display: allDataInfo.sCharger==""?"none":"block"}}>▸ if S, this vehicle is supercharged <span>{allDataInfo.sCharger}</span></li>
            <li style={{display: allDataInfo.tCharger==""?"none":"block"}}>▸ if T, this vehicle is turbocharged <span>{allDataInfo.tCharger}</span></li>
          </ul>
      </div>
    </div>
    </div>
  );
}
