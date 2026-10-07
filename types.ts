import { Card, List } from "@/generated/prisma/browser";

export type ListWithCards = List & { cards: Card[] };

export type CardWithList = Card & { list: List };
