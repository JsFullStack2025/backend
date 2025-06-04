import { ApiProperty } from "@nestjs/swagger";

export class CreateCardDto {
    @ApiProperty({ description: "Id автора", nullable: false })
    authorId: number;

    @ApiProperty({ description: "title карточки", nullable: true })
    title?: string;
    @ApiProperty({ description: "shared url карточки", nullable: true })    
    sharedUrl?: string;

    @ApiProperty({ description: "cardData в формате json", nullable: true })
    cardData?: string;

    @ApiProperty({ description: "ID прототипа карточки", nullable: true })
    designPrototypeId?: number;

    @ApiProperty({ description: "Признак что карточка опубликована", nullable: true, default: false})
    shared?: boolean | undefined
}

export class UpdateCardDto extends CreateCardDto {
    @ApiProperty({ description: "id карточки", nullable: false })
    id: number;
}