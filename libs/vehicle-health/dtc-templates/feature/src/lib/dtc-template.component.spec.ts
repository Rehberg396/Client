/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import {
  DtcTemplate,
  LoadingHandler,
  PagingResponseModel,
  RequestStatus,
} from '@cps/types';
import { ActionColumn, ColumnConfig, ConfirmDialogComponent } from '@cps/ui';
import { DtcTemplateStore } from '@cps/vehicle-health/dtc-templates/data-access';
import { DtcFormComponent } from '@cps/vehicle-health/dtc-templates/ui';
import { Observable, ReplaySubject } from 'rxjs';
import { DtcTemplateComponent } from './dtc-template.component';
import {
  provideRouter,
  Router,
  withComponentInputBinding,
} from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

describe(DtcTemplateComponent.name, () => {
  async function setup() {
    const criticalities$ = new ReplaySubject<string[]>();
    const engineTypes$ = new ReplaySubject<string[]>();
    const dtcTemplatePage$ = new ReplaySubject<
      RequestStatus<PagingResponseModel<DtcTemplate>>
    >();

    const mockStore = {
      delete: jest.fn(),
      edit: jest.fn(),
      create: jest.fn(),
      selectSignal: jest.fn(),
      searchDtcTemplates: jest.fn(),
      selectors: {
        criticalities$: criticalities$.asObservable(),
        engineTypes$: engineTypes$.asObservable(),
        dtcTemplatePage$: dtcTemplatePage$.asObservable(),
      },
    };

    mockStore.selectSignal.mockImplementation((fn) => {
      const result = fn({
        criticalities: ['test'],
        risks: ['test'],
        engineTypes: ['test'],
      });
      return () => result;
    });

    const dialogRef = {
      componentInstance: {
        onClickConfirm: jest.fn(),
        handleSubmit: jest.fn(),
        isLoading: {
          set: jest.fn(),
        },
      },
      close: jest.fn(),
    };

    const mockDialog = {
      open: jest.fn().mockReturnValue(dialogRef),
    };

    await TestBed.configureTestingModule({
      imports: [DtcTemplateComponent],
      providers: [
        provideNoopAnimations(),
        provideRouter(
          [{ path: '**', component: DtcTemplateComponent }],
          withComponentInputBinding()
        ),
      ],
    }).compileComponents();

    TestBed.overrideProvider(DtcTemplateStore, {
      useValue: mockStore,
    });
    TestBed.overrideProvider(MatDialog, { useValue: mockDialog });

    const fixture = TestBed.createComponent(DtcTemplateComponent);
    const harness = await RouterTestingHarness.create();
    const router = TestBed.inject(Router);
    jest.spyOn(router, 'navigate');
    const component = fixture.componentInstance;

    criticalities$.next(['serious', 'high']);
    engineTypes$.next(['generic', 'gasoline']);
    dtcTemplatePage$.next({
      loadingState: 'loaded',
      data: {
        content: [
          {
            id: 'test',
            source: 'test',
            category: 'test',
            group: 'test',
            protocolStandard: 'test',
            dtcCode: 'test',
            oem: 'test',
            description: 'test',
            possibleCause: 'test',
            symptom: 'test',
            criticality: 'test',
            recommendations: ['test'],
            comment: 'test',
            engineType: 'test',
            riskSafety: 'test',
            riskDamage: 'test',
            riskAvailability: 'test',
            riskEmissions: 'test',
          },
        ],
        links: [],
        page: {
          number: 0,
          size: 1,
          totalElements: 1,
          totalPages: 1,
        },
      },
    });

    fixture.detectChanges();

    return {
      component,
      fixture,
      mockStore,
      mockDialog,
      dialogRef,
      engineTypes$,
      criticalities$,
      harness,
      router,
      dtcTemplatePage$,
    };
  }

  function getActionButton(
    component: DtcTemplateComponent,
    action: 'edit' | 'delete'
  ) {
    return component
      .columnConfigs()
      .filter(
        (d): d is ColumnConfig<DtcTemplate> & ActionColumn<DtcTemplate> =>
          d.type === 'action'
      )
      .flatMap((d) => d.actions)
      .find(
        (d) => d.icon({} as unknown as DtcTemplate) === `bosch-ic-${action}`
      );
  }

  describe('add dtc', () => {
    it('should open dialog add', async () => {
      const { component, mockDialog } = await setup();
      component.onCreate();
      expect(mockDialog.open).toHaveBeenCalledWith(DtcFormComponent, {
        width: '60%',
        disableClose: true,
        data: {
          dtcItem: undefined,
          options: {
            risks: ['test'],
            criticalities: ['test'],
            engineTypes: ['test'],
          },
        },
      });
    });

    it('should call add dtc has valid data', async () => {
      const { component, mockStore, dialogRef } = await setup();
      const mockCreateDtc = {
        id: 'test',
        category: 'create',
      } as DtcTemplate;
      mockStore.create.mockImplementation(
        (args: { handler: LoadingHandler }) => {
          args.handler.handleLoading(true);
          args.handler.handleLoading(false);
          args.handler.onSuccess();
          return new Observable().subscribe();
        }
      );

      component.onCreate();
      dialogRef.componentInstance.handleSubmit(mockCreateDtc);

      expect(mockStore.create).toHaveBeenCalledTimes(1);
      const createArg = mockStore.create.mock.calls[0][0];
      expect(createArg.dtcData).toEqual(mockCreateDtc);
      expect(dialogRef.componentInstance.isLoading.set).toHaveBeenCalledTimes(
        2
      );
      expect(dialogRef.close).toHaveBeenCalledTimes(1);
    });

    it('should do nothing if close dialog notification has no data', async () => {
      const { component, mockStore } = await setup();
      component.onCreate();
      expect(mockStore.edit).not.toHaveBeenCalled();
    });
  });

  describe('update dtc', () => {
    it('should open dialog update', async () => {
      const { component, mockDialog } = await setup();

      const mockDtc = {
        category: 'test',
      } as DtcTemplate;

      const editBtn = getActionButton(component, 'edit');

      editBtn!.onClick!(mockDtc);

      expect(mockDialog.open).toHaveBeenCalledWith(DtcFormComponent, {
        width: '60%',
        disableClose: true,
        data: {
          dtcItem: mockDtc,
          options: {
            risks: ['test'],
            criticalities: ['test'],
            engineTypes: ['test'],
          },
        },
      });
    });

    it('should call update dtc and show loading icon if data is valid', async () => {
      const { component, mockStore, dialogRef } = await setup();
      const editBtn = getActionButton(component, 'edit');
      const mockDtc = {
        category: 'test',
      } as DtcTemplate;
      editBtn!.onClick!(mockDtc);

      const mockUpdateDtc = {
        id: 'test',
        category: 'update',
      } as DtcTemplate;

      mockStore.edit.mockImplementation((args: { handler: LoadingHandler }) => {
        args.handler.handleLoading(true);
        args.handler.handleLoading(false);
        args.handler.onSuccess();
        return new Observable().subscribe();
      });

      dialogRef.componentInstance.handleSubmit(mockUpdateDtc);

      expect(mockStore.edit).toHaveBeenCalledTimes(1);
      const args = mockStore.edit.mock.calls[0][0];
      expect(args.dtcData).toEqual(mockUpdateDtc);
      expect(dialogRef.componentInstance.isLoading.set).toHaveBeenCalledTimes(
        2
      );
      expect(dialogRef.close).toHaveBeenCalledTimes(1);
    });

    it('should do nothing if close dialog', async () => {
      const { component, mockStore } = await setup();
      const editBtn = getActionButton(component, 'edit');
      editBtn!.onClick!({} as DtcTemplate);
      expect(mockStore.edit).not.toHaveBeenCalled();
    });
  });

  describe('delete dtc', () => {
    it('should open confirm dialog', async () => {
      const { component, mockDialog } = await setup();
      const deleteBtn = getActionButton(component, 'delete');
      deleteBtn!.onClick!({} as DtcTemplate);

      expect(mockDialog.open).toHaveBeenCalledWith(ConfirmDialogComponent, {
        data: {
          title: 'Delete DTC Template',
          contentTitle: 'Are you sure to delete?',
          leftButtonText: 'Confirm',
          rightButtonText: 'Cancel',
        },
      });
    });

    it('should call delete with correct parameters when onClickConfirm is called', async () => {
      const { component, mockStore, dialogRef } = await setup();
      const mockDeleteDtc = {
        id: 'id',
      } as DtcTemplate;
      const deleteBtn = getActionButton(component, 'delete');
      deleteBtn!.onClick!(mockDeleteDtc);

      mockStore.delete.mockImplementation(
        (args: { handler: LoadingHandler }) => {
          args.handler.handleLoading(true);
          args.handler.handleLoading(false);
          args.handler.onSuccess();
          return new Observable().subscribe();
        }
      );

      dialogRef.componentInstance.onClickConfirm();

      expect(mockStore.delete).toHaveBeenCalledTimes(1);
      const args = mockStore.delete.mock.calls[0][0];
      expect(mockStore.delete).toHaveBeenCalled();
      expect(args.dtcData).toEqual(mockDeleteDtc);
      expect(dialogRef.componentInstance.isLoading.set).toHaveBeenCalledTimes(
        2
      );
      expect(dialogRef.close).toHaveBeenCalledTimes(1);
    });

    it('should set confirmDialog.isLoading when handleLoading is called', async () => {
      const { component, mockStore, dialogRef } = await setup();

      const mockDeleteDtc = {
        id: 'test',
        category: 'delete',
      } as DtcTemplate;

      const deleteBtn = getActionButton(component, 'delete');
      deleteBtn!.onClick!(mockDeleteDtc);

      mockStore.delete.mockImplementation(
        (args: { handler: LoadingHandler }) => {
          args.handler.handleLoading(true);
          args.handler.handleLoading(false);
          args.handler.onSuccess();
          return new Observable().subscribe();
        }
      );

      dialogRef.componentInstance.onClickConfirm();

      const deleteArg = mockStore.delete.mock.calls[0][0];

      expect(mockStore.delete).toHaveBeenCalled();
      expect(deleteArg.dtcData).toEqual(mockDeleteDtc);
      expect(dialogRef.componentInstance.isLoading.set).toHaveBeenCalledTimes(
        2
      );
      expect(dialogRef.close).toHaveBeenCalled();
    });

    it('should do nothing when confirm false', async () => {
      const { component, mockStore } = await setup();
      const deleteBtn = getActionButton(component, 'delete');
      deleteBtn!.onClick!({} as DtcTemplate);
      expect(mockStore.delete).not.toHaveBeenCalled();
    });
  });

  it('onSearch', async () => {
    const { component, router } = await setup();
    component.onSearch('test');
    expect(router.navigate).toHaveBeenCalledWith([], {
      queryParams: {
        search: 'test',
        page: 0,
      },
      queryParamsHandling: 'merge',
    });
  });

  it('onPage', async () => {
    const { component, router } = await setup();
    component.onPage({ pageIndex: 1, pageSize: 10, length: 100 });
    expect(router.navigate).toHaveBeenCalledWith([], {
      queryParams: {
        page: 1,
        size: 10,
      },
      queryParamsHandling: 'merge',
    });
  });

  it('onTableColumnConfigsChange', async () => {
    const { component, router } = await setup();
    component.onTableColumnConfigsChange(['a', 'b']);
    expect(router.navigate).toHaveBeenCalledWith([], {
      queryParams: {
        displayedColumns: 'a,b',
      },
      queryParamsHandling: 'merge',
    });
  });

  it('onFilterChange', async () => {
    const { component, router } = await setup();
    component.onFilterChange([
      {
        key: 'engineTypes',
        selectOption: [
          {
            label: 'Gasoline',
            value: 'gasoline',
            isChecked: true,
          },
        ],
        title: 'Engine Type',
        isChecked: true,
      },
      {
        key: 'criticalities',
        selectOption: [
          {
            label: 'Serious',
            value: 'serious',
            isChecked: true,
          },
        ],
        title: 'Criticality',
        isChecked: true,
      },
    ]);
    expect(router.navigate).toHaveBeenCalledWith([], {
      queryParams: {
        filters: 'criticalities:serious;engineTypes:gasoline',
        page: 0,
      },
      queryParamsHandling: 'merge',
    });
  });

  it('should search by page = 0, size = 5, filters = criticalities:serious;engineTypes:gas, and search = test', async () => {
    const { harness, mockStore } = await setup();
    await harness.navigateByUrl(
      '/fleet-overview?page=0&size=5&search=test&filters=criticalities:serious;engineTypes:gas',
      DtcTemplateComponent
    );
    expect(mockStore.searchDtcTemplates).toHaveBeenCalledWith({
      page: 0,
      size: 5,
      search: 'test',
      criticalities: ['serious'],
      engineTypes: ['gas'],
    });
  });

  it('tableColumnConfigs', async () => {
    const { harness } = await setup();
    const component = await harness.navigateByUrl(
      '/fleet-overview?displayedColumns=dtcCode',
      DtcTemplateComponent
    );
    expect(component.tableColumnConfigs()).toEqual([
      { key: 'action', title: 'Actions', isChecked: false },
      { key: 'source', title: 'Source', isChecked: false },
      { key: 'category', title: 'Category', isChecked: false },
      { key: 'group', title: 'Group', isChecked: false },
      { key: 'engineType', title: 'Engine Type', isChecked: false },
      { key: 'protocolStandard', title: 'Protocol Standard', isChecked: false },
      { key: 'dtcCode', title: 'DTC Code', isChecked: true },
      { key: 'oem', title: 'OEM', isChecked: false },
      { key: 'description', title: 'DTC Description', isChecked: false },
      { key: 'possibleCause', title: 'Possible Cause', isChecked: false },
      { key: 'symptom', title: 'Symptom', isChecked: false },
      { key: 'criticality', title: 'Criticality', isChecked: false },
      { key: 'recommendations', title: 'Recommendation', isChecked: false },
      { key: 'comment', title: 'Comment', isChecked: false },
      { key: 'riskSafety', title: 'Risk Safety', isChecked: false },
      { key: 'riskDamage', title: 'Risk Availability', isChecked: false },
      { key: 'riskAvailability', title: 'Risk Damage', isChecked: false },
      { key: 'riskEmissions', title: 'Risk Emissions', isChecked: false },
    ]);
  });
});
