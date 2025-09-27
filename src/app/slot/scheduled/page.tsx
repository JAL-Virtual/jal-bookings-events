import {LinkButton} from "../../../components/buttons/LinkButton";
import {MutedText} from "../../../components/typography/Typography";
import {useText} from "../../../hooks/useText";
import {SlotInformationLayout} from "../../../layouts/SlotInformationLayout";
import {useEffect, useState} from "react";
import {useParams, useRouter, useSearchParams} from "next/navigation";

export default function SlotScheduled() {
  const [eventId, setEventId] = useState<number>();
  const params = useParams();
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
      image={<img width={183} height={183} src="/img/check-blue.svg" alt="Símbolo confirmação agendamento"/>}
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
