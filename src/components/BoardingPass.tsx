'use client';

import React, { ReactNode } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';

export enum BoardingPassType {
  DEPARTURE,
  ARRIVAL,
}

interface BoardingPassProps {
  themeColor?: string;
  user: {
    firstName: string;
    lastName: string;
    vid: string;
  };
  origin: {
    name: string;
    iata: string;
  };
  destination: {
    name: string;
    iata: string;
  };
  callsign: string;
  slotDate: string;
  gate: string;
  type: BoardingPassType;
  eventStartDate: Date;
  actions?: ReactNode;
}

const defaultThemeColor = "#0d2c99";

const formatDate = (date: Date) => {
  const months = [
    "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
    "JUL", "AUG", "SEP", "OCT", "NOV", "DEC",
  ];

  const day = date.getUTCDate();
  const month = date.getUTCMonth();
  const year = date.getUTCFullYear();

  return [
    day.toString().padStart(2, "0"),
    months[month],
    year.toString().substring(2),
  ].join(" ");
};

const BoardingPassHeader: React.FC<BoardingPassProps> = ({
  themeColor = defaultThemeColor,
  actions
}) => {
  return (
    <header
      style={{ backgroundColor: themeColor }}
      className="flex w-full rounded-t-lg px-4 py-4 pl-11"
    >
      <div>
        <span className="block text-white font-bold text-sm leading-5 uppercase font-nunito">
          Cartão de Embarque
        </span>
        <span className="block text-white text-xs leading-4 uppercase font-nunito">
          Boarding Pass
        </span>
      </div>
      <div className="ml-auto">
        {actions}
      </div>
    </header>
  );
};

const BoardingPassLeftSide: React.FC<BoardingPassProps> = ({
  themeColor = defaultThemeColor,
  user,
  callsign,
  origin,
  destination,
  gate,
  slotDate,
  eventStartDate,
  type,
}) => {
  return (
    <div className="w-[789px]">
      <div className="pt-3 w-full flex pl-11">
        <span className="flex flex-col flex-1 min-w-[423px]">
          <span className="font-nunito text-xs leading-4 uppercase">
            Nome/Name
          </span>
          <span className="font-nunito text-sm leading-5 font-bold flex items-center">
            {user.lastName}, {user.firstName}
          </span>
        </span>
        <span className="flex flex-col flex-1 min-w-[423px]">
          <span className="font-nunito text-xs leading-4 uppercase">
            Localizador
          </span>
          <span className="font-nunito text-sm leading-5 font-bold flex items-center">
            {user.vid}
          </span>
        </span>
      </div>

      <div
        style={{ backgroundColor: themeColor, color: themeColor }}
        className="relative mt-2 ml-9 w-[717px] h-5 flex items-center"
      >
        <span className="ml-2 mt-0.5 uppercase font-nunito text-xs leading-4 font-bold text-white">
          de/from
        </span>
        <span className="ml-40 uppercase font-nunito text-xs leading-4 font-bold text-white">
          voo/flight
        </span>
        <span className="ml-40 uppercase font-nunito text-xs leading-4 font-bold text-white">
          destino/arrival
        </span>
        <div className="absolute left-full w-0 h-0 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent border-l-[10px] border-l-current"></div>
      </div>

      <div className="mx-0 mb-5 ml-11 font-poppins uppercase flex">
        <div className="flex-basis-[205px] flex flex-col">
          <div className="font-semibold">
            {origin.name}/{origin.iata}
          </div>
          <div className="font-header mt-auto">
            <div className="font-light text-[0.56rem] leading-3">Data/Date</div>
            <div className="text-sm">{formatDate(eventStartDate)}</div>
          </div>
          <div className="font-header mt-auto">
            <div className="font-light text-[0.56rem] leading-3">posição/stand</div>
            <div className="text-[2rem] leading-[2.6rem] font-extrabold">{gate}</div>
          </div>
        </div>
        <div className="flex-basis-[218px] flex flex-col">
          <div className="font-semibold">
            {callsign}
          </div>
          <div className="font-header mt-auto">
            <div className="font-light text-[0.56rem] leading-3">Grupo/Group</div>
            <div className="text-sm">G1</div>
          </div>
          <div className="font-header mt-auto">
            <div className="font-light text-[0.56rem] leading-3">
              {type === BoardingPassType.DEPARTURE ? "EOBT(UTC)" : "ETA(UTC)"}
            </div>
            <div className="text-[2rem] leading-[2.6rem] font-extrabold">{slotDate}</div>
          </div>
        </div>
        <div className="flex-basis-[242px] flex flex-col">
          <div className="font-semibold">
            {destination.name}/{destination.iata}
          </div>
          <div className="w-[270px] h-auto flex justify-between items-center mt-auto">
            <div className="w-[158px] font-nunito font-extrabold text-[9.7px] leading-[13px] border-3 border-gray-900 dark:border-white p-1.5">
              Para participar do evento você deve estar ciente e disposto a
              cumprir todas as orientações disponíveis no briefing de piloto
            </div>
            <QRCodeSVG value="https://br.ivao.aero" size={76} />
          </div>
        </div>
      </div>
    </div>
  );
};

const BoardingPassRightSide: React.FC<BoardingPassProps> = ({
  user,
  origin,
  callsign,
  destination,
  slotDate,
  type,
  eventStartDate
}) => {
  return (
    <div className="h-auto border-l border-dashed border-gray-900 dark:border-white w-[185px]">
      <div className="uppercase font-nunito text-xs leading-4 flex flex-col pl-6 pt-3">
        <div>nome/name</div>
        <div className="font-bold text-sm leading-5">
          {user.lastName}, {user.firstName}
        </div>
      </div>
      
      <div className="pl-6 pt-3 pr-4 flex justify-between items-start">
        <div className="flex justify-center font-nunito font-extrabold text-sm leading-5 flex items-center">
          {origin.iata}
        </div>
        <div className="flex flex-col">
          <div>
            <PaperAirplaneIcon className="w-4 h-4" />
          </div>
          <div className="text-xs leading-3">{callsign}</div>
        </div>
        <div className="flex justify-center font-nunito font-extrabold text-sm leading-5 flex items-center">
          {destination.iata}
        </div>
      </div>
      
      <div className="flex mt-2 pl-6 pr-4 justify-between">
        <div>
          <div className="uppercase font-nunito font-light text-[9px] leading-3">Data/Date</div>
          <div className="font-normal text-xs leading-4">{formatDate(eventStartDate)}</div>
        </div>
        <div>
          <div className="uppercase font-nunito font-light text-[9px] leading-3">
            {type === BoardingPassType.DEPARTURE ? "EOBT(UTC)" : "ETA(UTC)"}
          </div>
          <div className="text-right font-normal text-xs leading-4">{slotDate}</div>
        </div>
      </div>
      
      <div className="flex mt-2 pl-6 pt-3 pr-4 justify-between">
        <div>
          <div className="uppercase font-nunito font-light text-[9px] leading-3">Grupo/Group</div>
          <div className="font-normal text-xs leading-4">G1</div>
        </div>
        <div>
          <div className="uppercase font-nunito font-light text-[9px] leading-3">Assento/Seat</div>
          <div className="text-right font-extrabold text-2xl leading-6">1A</div>
        </div>
      </div>
    </div>
  );
};

export const BoardingPass: React.FC<BoardingPassProps> = (props) => {
  return (
    <section style={{ minWidth: "976px" }}>
      <BoardingPassHeader {...props} />
      <main className="bg-white dark:bg-gray-900 shadow-sm rounded-b-lg flex">
        <BoardingPassLeftSide {...props} />
        <BoardingPassRightSide {...props} />
      </main>
    </section>
  );
};
