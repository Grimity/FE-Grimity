import { useState } from "react";
import FeedForm from "@/components/Upload/FeedForm/FeedForm";

import { useFeedSubmit } from "@/hooks/useFeedSubmit";

import type { CreateFeedRequest } from "@grimity/dto";

export default function Upload() {
  const { submitFeed, isSubmitting } = useFeedSubmit();
  const [formHandlers, setFormHandlers] = useState<{ resetUnsavedChanges: () => void } | null>(
    null,
  );

  const handleSubmit = (data: CreateFeedRequest) => {
    submitFeed({
      isEditMode: false,
      data,
      onSuccess: () => formHandlers?.resetUnsavedChanges(),
    });
  };

  return (
    <FeedForm
      isEditMode={false}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      onStateUpdate={setFormHandlers}
    />
  );
}
