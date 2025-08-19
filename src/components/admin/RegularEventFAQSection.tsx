"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { PlusCircle, MinusCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import RichTextEditor from "@/components/RichTextEditor";

interface FAQItem {
  id?: string;
  question: string;
  answer: string;
  order_index: number;
}

interface RegularEventFAQSectionProps {
  faqs: FAQItem[];
  setFaqs: (faqs: FAQItem[]) => void;
}

const RegularEventFAQSection: React.FC<RegularEventFAQSectionProps> = ({ faqs, setFaqs }) => {
  const { t } = useTranslation();

  const handleAddFAQ = () => {
    setFaqs([...faqs, { question: "", answer: "", order_index: faqs.length }]);
  };

  const handleRemoveFAQ = (index: number) => {
    const newFaqs = faqs.filter((_, i) => i !== index);
    setFaqs(newFaqs.map((item, idx) => ({ ...item, order_index: idx }))); // Re-index
  };

  const handleFAQChange = (index: number, field: keyof FAQItem, value: string) => {
    const newFaqs = [...faqs];
    newFaqs[index] = { ...newFaqs[index], [field]: value };
    setFaqs(newFaqs);
  };

  return (
    <>
      <Separator className="my-6" />
      <h3 className="text-lg font-semibold mb-4">{t('frequently asked questions')}</h3>
      {faqs.map((faq, index) => (
        <Card key={index} className="p-4 mb-4 border border-border">
          <div className="flex justify-end mb-2">
            <Button variant="destructive" size="sm" onClick={() => handleRemoveFAQ(index)}>
              <MinusCircle className="h-4 w-4 mr-2" /> {t('remove faq button')}
            </Button>
          </div>
          <div className="space-y-2">
            <div>
              <Label>{t('question label')}</Label>
              <Input
                placeholder={t('question placeholder')}
                value={faq.question}
                onChange={(e) => handleFAQChange(index, 'question', e.target.value)}
              />
            </div>
            <div>
              <Label>{t('answer label')}</Label>
              <RichTextEditor
                componentKey={`faq-answer-${index}-${faq.id || 'new'}`}
                value={faq.answer}
                onChange={(value) => handleFAQChange(index, 'answer', value)}
                placeholder={t('answer placeholder')}
                className="min-h-[100px]"
              />
            </div>
          </div>
        </Card>
      ))}
      <Button type="button" variant="secondary" onClick={handleAddFAQ}>
        <PlusCircle className="h-4 w-4 mr-2" /> {t('add faq button')}
      </Button>
    </>
  );
};

export default RegularEventFAQSection;