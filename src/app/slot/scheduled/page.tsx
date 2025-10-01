"use client";

import {LinkButton} from "../../../components/buttons/LinkButton";
import {MutedText} from "../../../components/typography/Typography";
import {useText} from "../../../hooks/useText";
import {SlotInformationLayout} from "../../../layouts/SlotInformationLayout";
import {PageTransition} from "../../../components";
import {useEffect, useState, Suspense} from "react";
import {useRouter, useSearchParams} from "next/navigation";
import Image from "next/image";

function SlotScheduledContent() {
  const [eventId, setEventId] = useState<number>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const {t} = useText();

  useEffect(() => {
    const eventIdParam = searchParams.get('eventId');
    if (!eventIdParam) {
      router.replace("/404");
      return;
    }

    const parsedEventId = parseInt(eventIdParam);
    if (isNaN(parsedEventId)) {
      router.replace("/404");
      return;
    }

    setEventId(parsedEventId);
    
    // Clear URL parameters
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete('eventId');
    router.replace(`${window.location.pathname}?${newSearchParams.toString()}`);
  }, [router, searchParams]);

  return (
    <SlotInformationLayout
      header={t('notification.scheduled.title')}
      description={(
        <MutedText textSize="text-[18px]">
          {t('notification.scheduled.subtitle')}
        </MutedText>
      )}
      image={<Image width={183} height={183} src="/img/check-blue.svg" alt="Símbolo confirmação agendamento"/>}
      actions={
        <LinkButton
          content={t('generics.back')}
          width="w-44"
          backgroundColor="bg-[#858585] dark:bg-[#525252]"
          href={`/event/${eventId}/my-slots`}/>
      }
    >
    </SlotInformationLayout>
  )
}

export default function SlotScheduled() {
  return (
    <PageTransition type="scale">
      <Suspense fallback={<div>Loading...</div>}>
        <SlotScheduledContent />
      </Suspense>
    </PageTransition>
  );
}
