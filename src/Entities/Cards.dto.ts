import { ApiProperty } from "@nestjs/swagger";

export class CardsDto {
    @ApiProperty({ description: "id карточки", nullable: true })
    id: string;

    @ApiProperty({ description: "Id автора", nullable: false })
    authorId: number;

    @ApiProperty({ description: "cardData в формате json", nullable: true })
    cardData: string;
}