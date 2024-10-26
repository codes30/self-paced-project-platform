"use client";

import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

const SwaggerUIComponent = ({ challengeName }: { challengeName: string }) => {
  return (
    <div id="apiSpecs" className="flex justify-center items-center">
      <SwaggerUI
        supportedSubmitMethods={[]}
        url={`/data/${challengeName}.spec.yaml`}
      />
    </div>
  );
};

export default SwaggerUIComponent;
