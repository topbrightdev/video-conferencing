import { BreakPointEnum } from '../types';

export const getBreakPoint = (): BreakPointEnum => {
    const { innerWidth } = window;
    if (innerWidth < 640) {
        return BreakPointEnum.XS;
    } else if (innerWidth < 768) {
        return BreakPointEnum.SM;
    } else if (innerWidth < 1024) {
        return BreakPointEnum.MD;
    } else if (innerWidth < 1280) {
        return BreakPointEnum.LG;
    }
    return BreakPointEnum.XL;
};
