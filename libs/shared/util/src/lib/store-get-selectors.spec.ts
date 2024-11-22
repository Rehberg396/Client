import { take } from 'rxjs';
import { ComponentStoreWithSelectors } from './store-get-selectors';

interface MockState {
  id: number;
  name: string;
}

describe(ComponentStoreWithSelectors.name, () => {
  const initialState: MockState = {
    id: 1,
    name: 'name',
  };
  let componentStore: ComponentStoreWithSelectors<MockState>;
  beforeEach(() => {
    componentStore = new ComponentStoreWithSelectors<MockState>(initialState);
  });
  it('should create selector', () => {
    expect(componentStore.selectors).toBeTruthy();
  });
  it('selector should can query state', () => {
    componentStore.selectors.id$.pipe(take(1)).subscribe((value) => {
      expect(value).toEqual(initialState.id);
    });
    componentStore.selectors.name$.pipe(take(1)).subscribe((value) => {
      expect(value).toEqual(initialState.name);
    });
  });
});
