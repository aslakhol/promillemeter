"use client";

import { Button } from "@/components/ui/button";
import type { ExampleData, UserData } from "@/lib/types";

const exampleData: ExampleData[] = [
  {
    name: "Cognac Party på Mir",
    description: "Vi har bilder!",
    data: {
      bacInput: 1,
      masl: 350000,
      weight: 70,
      gender: "male",
      drinks: [],
      drinkingDuration: 0,
    },
  },
  {
    name: "Nattverd på månen",
    description: "Bare en liten slurk",
    data: {
      bacInput: null,
      masl: 384400000,
      weight: 75,
      gender: "male",
      drinks: [
        {
          id: "moon-drink",
          size: 5,
          alcoholPercentage: 10,
        },
      ],
      drinkingDuration: 0,
    },
  },
  {
    name: "Verdens fulleste mann",
    description: "Testet 5 ganger til 14.8‰",
    data: {
      bacInput: 14.8,
      masl: 105,
      weight: 85,
      gender: "male",
      drinks: [],
      drinkingDuration: 0,
    },
  },
];

interface ExampleDataProps {
  onSelectExample: (data: Partial<UserData>) => void;
}

export function ExampleDataButtons({ onSelectExample }: ExampleDataProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {exampleData.map((example) => (
        <Button
          key={example.name}
          variant="outline"
          className="h-auto py-4 flex flex-col items-center text-center"
          onClick={() => onSelectExample(example.data)}
        >
          <span className="font-bold">{example.name}</span>
          <span className="text-sm text-muted-foreground mt-1">
            {example.description}
          </span>
        </Button>
      ))}
    </div>
  );
}
