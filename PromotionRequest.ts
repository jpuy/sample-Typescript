export interface IPromotionLocationRequest {
    LocationId: string;
}

export interface ICreatePromotionRequest {
    SiteNumber: string;
    CampaignId: string;
    Description: string;
    PlayerSegmentId: string;
    CouponValue: string;
    CouponCount: string;
    TotalValue: string;
    StartDate: string;
    EndDate: string;
    HoursFrom: string;
    MinutesFrom: string;
    HoursTo: string;
    MinutesTo: string;
    Timezone: string;
    Repeat: string;
    Frequency: string;
    Every: string;
    Day: string;
    Weekly: number[];
    Monthly: number[];
    Yearly: number[];
    AllDay: boolean;
    Notes: string;
    Locations: number[];
}
