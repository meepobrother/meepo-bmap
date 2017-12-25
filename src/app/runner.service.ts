import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Subject } from 'rxjs/Subject';
@Injectable()
export class RunnerService {
    class$: Subject<any> = new Subject();
    distance$: Subject<any> = new Subject();
    timePriceSuccess$: Subject<any> = new Subject();
    getDistanceSuccess$: Subject<any> = new Subject();

    juliJietiItems: any[] = [];
    weightItems: any[] = [];

    time: any = new Date().getTime()
    constructor(
        public api: ApiService
    ) {
        this.distance$.asObservable().debounceTime(300).subscribe(res => {
            this.distancePrice(res);
        });
        console.log('runner service', this.time);
    }

    runnerClass() {
        this.api.mpost('v2setting.tasksClass', {}).subscribe((res: any) => {
            this.class$.next(res.info);
        });
    }


    distancePrice(setting: any) {
        this.juliJietiItems = [];
        const distance = setting.distance;
        const routeLen = distance;
        const duration = setting.duration;
        const juliItems = setting.juliItems;
        if (juliItems) {
            juliItems.map((res: any) => {
                if (res.end > 0 && routeLen > res.start && routeLen <= res.end) {
                    res['chazhi'] = routeLen - res.start;
                    if (res['chazhi'] > 0) {
                        this.juliJietiItems.push({
                            start: res.start,
                            end: routeLen,
                            price: res.price,
                            money: Number(res['chazhi'] * res.price).toFixed(2)
                        });
                    }
                } else if (res.end > 0 && routeLen > res.start && routeLen > res.end) {
                    res['chazhi'] = res.end - res.start;
                    if (res['chazhi'] > 0) {
                        this.juliJietiItems.push({
                            start: res.start,
                            end: res.end,
                            price: res.price,
                            money: Number(res['chazhi'] * res.price).toFixed(2)
                        });
                    }
                } else if (!res.end && res.start > 0 && routeLen > res.start) {
                    res['chazhi'] = routeLen - res.start;
                    if (res['chazhi'] > 0) {
                        this.juliJietiItems.push({
                            start: res.start,
                            end: routeLen,
                            price: res.price,
                            money: Number(res['chazhi'] * res.price).toFixed(2)
                        });
                    }
                }
            });
            this.getDistanceSuccess$.next(this.juliJietiItems);
        }
    }

    timePrice(setting: any) {
        let timeAddItem = {
            price: 0
        };
        const timeItems = setting.timeItems;
        let myData = setting.date;
        myData = myData || new Date();
        const Hour = myData.getHours();
        const minute = myData.getMinutes();


        timeItems.map(res => {
            const start = res.start.split(':');
            const end = res.end.split(':');
            const startHour = parseInt(start[0], 10);
            const startMinute = parseInt(start[1], 10);
            const endHour = parseInt(end[0], 10);
            const endMinute = parseInt(end[1], 10);

            if (Hour > startHour && Hour < endHour) {
                if (res) {
                    timeAddItem = res;
                }
            } else if (Hour === startHour && Hour === endHour) {
                if (minute >= startMinute && minute <= endMinute) {
                    if (res) {
                        timeAddItem = res;
                    }
                }
            } else if (Hour < startHour || Hour > endHour) {

            } else {
                if (minute >= startMinute) {
                    if (res) {
                        timeAddItem = res;
                    }
                }
            }
        });
        this.timePriceSuccess$.next(timeAddItem);
    }

    weightPrice(setting: any) {
        const weight = setting.weight;
        const weightItems = setting.weightItems;
        const len = weight;
        weightItems.map(res => {
            if (res.end > 0 && len > res.start && len <= res.end) {
                res['chazhi'] = len - res.start;
                if (res['chazhi'] > 0) {
                    this.weightItems.push({
                        start: res.start,
                        end: len,
                        price: res.price,
                        money: Number(res['chazhi'] * res.price).toFixed(2)
                    });
                }
            } else if (res.end > 0 && len > res.start && len > res.end) {
                res['chazhi'] = res.end - res.start;
                if (res['chazhi'] > 0) {
                    this.weightItems.push({
                        start: res.start,
                        end: res.end,
                        price: res.price,
                        money: Number(res['chazhi'] * res.price).toFixed(2)
                    });
                }
            } else if (!res.end && res.start > 0 && len > res.start) {
                res['chazhi'] = len - res.start;
                if (res['chazhi'] > 0) {
                    this.weightItems.push({
                        start: res.start,
                        end: len,
                        price: res.price,
                        money: Number(res['chazhi'] * res.price).toFixed(2)
                    });
                }
            }
        });

    }
}
