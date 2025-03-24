import { ApiProperty } from "@nestjs/swagger";

export class CreateCardDto {
    @ApiProperty({ description: "Id автора", nullable: false })
    authorId: number;

    @ApiProperty({ description: "cardData в формате json", nullable: true })
    cardData?: string;

    @ApiProperty({ description: "Признак что карточка опубликована", nullable: true, default: false})
    shared?: boolean | undefined
}

export class UpdateCardDto {
    @ApiProperty({ description: "id карточки", nullable: false })
    id: number;
    cardData?: string;
    shared?: boolean | undefined
}