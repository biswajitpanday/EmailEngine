import { LogLevel } from '@azure/msal-node';
import AppConst from '../../utils/Constants';

const msalConfig = {
  auth: {
    clientId: AppConst.OutlookClientId,
    authority: 'https://login.microsoftonline.com/common',
    clientSecret: AppConst.OutlookClientSecret,
  },
  system: {
    loggerOptions: {
      loggerCallback: (level: any, message: any, containsPii: any) => {
        if (containsPii) {
          return;
        }
        switch (level) {
          case LogLevel.Error:
            console.error(message);
            return;
          case LogLevel.Info:
            console.info(message);
            return;
          case LogLevel.Verbose:
            console.debug(message);
            return;
          case LogLevel.Warning:
            console.warn(message);
            return;
        }
      },
    },
  },
};

export default msalConfig;
