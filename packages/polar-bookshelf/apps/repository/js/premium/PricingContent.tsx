import React from "react";
import {DeviceRouter} from "../../../../web/js/ui/DeviceRouter";
import {PricingContentForMobile} from "./PricingContentForMobile";
import {PricingContentForDesktop} from "./PricingContentForDesktop";

export const PricingContent = () => {

  return (
      <DeviceRouter handheld={<PricingContentForMobile/>}
                    desktop={<PricingContentForDesktop/>}/>
  );

}
