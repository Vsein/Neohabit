import {
  mdiSquareSmall,
  mdiCalendarTodayOutline,
  mdiCalendarWeekOutline,
  mdiStar,
} from '@mdi/js';

const defaultCategoryPictures = {
  All: mdiSquareSmall,
  Today: mdiCalendarTodayOutline,
  'This Week': mdiCalendarWeekOutline,
  Important: mdiStar,
};

export default class Filter {
  constructor(name, image = '') {
    this.name = name;
    if (!image && name in defaultCategoryPictures) {
      this.image = defaultCategoryPictures[name];
    }
  }
}
