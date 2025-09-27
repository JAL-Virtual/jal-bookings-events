"use client";

import { FunctionComponent } from "react";
import { VerticalInfoCard } from "./InfoCard";
import { Header, Subheader } from "./typography/Typography";
import { FiDownload, FiMap } from "react-icons/fi";
import { LinkButton } from "./buttons/LinkButton";
import { useText } from "../hooks/useText";

interface UserSlotsSideInfosProps {
  pilotBriefing: string;
}

export function UserSlotsSideInfos({ pilotBriefing }: UserSlotsSideInfosProps) {
  const { t } = useText();
  
  return (
    <aside className="px-6 pt-9 bg-white dark:bg-black h-full">
      <Header textSize="text-lg" textColor="text-blue-600 dark:text-white">
        {t('myFlights.title')}
      </Header>
      <Subheader textSize="text-md" textColor="text-blue-500 dark:text-white">
        {t('myFlights.subtitle')}
      </Subheader>
      <div className="mt-12">
        <VerticalInfoCard
          icon={<FiMap size={25} />}
          header={t('info.pilotBriefing.title')}
          content={t('info.pilotBriefing.description')}
        >
          <LinkButton
            width="w-full"
            height="h-9"
            icon={<FiDownload size={18} />}
            href={pilotBriefing}
            content={
              <span className="block w-full px-8 text-center font-semibold text-xs text-white">
                {t('generics.see')}
              </span>
            }
          />
        </VerticalInfoCard>
      </div>
    </aside>
  );
}