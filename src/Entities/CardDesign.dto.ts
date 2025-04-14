import { ApiProperty } from "@nestjs/swagger";

// json value of designData
export class CardDesignDto {
    bgImgUrl?: string;
    designData?: string;
}

export class CreateCardTypeDto {
    title: string;
    description: string;
    designData?: string;
}

export class UpdateCardTypeDto extends CreateCardTypeDto {
    @ApiProperty({ description: "id карточки", nullable: false })
    id: number;
}