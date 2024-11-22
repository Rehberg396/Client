import { HttpClient } from '@angular/common/http';
import { ApiResponseModel, DiagnosticStep } from '@cps/types';
import { Observable, Subject, of, throwError } from 'rxjs';
export class DiagnosticService {
  private readonly baseUrl: string;
  private readonly serverURL = 'http://localhost:3000/events';
  private eventSource: EventSource | null = null;
  private diagnosticStepsSubject = new Subject<DiagnosticStep[]>();

  constructor(
    baseUrl: string,
    private http: HttpClient,
  ) {
    this.baseUrl = `${baseUrl}/diagnostic`;
  }

  fetchDiagnosticSteps(vin: string) {
    return this.http.post<ApiResponseModel<DiagnosticStep[]>>(
      `${this.baseUrl}/diagnostic/get`,
      {
        vin,
      },
    );
  }

  startDiagnostic(): Observable<DiagnosticStep[]> {
    if (this.eventSource) {
      return throwError(() => new Error('Diagnosis already in progress'));
    }

    this.eventSource = new EventSource(this.serverURL);

    this.eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === 'end') {
        this.closeConnection();
      } else {
        this.diagnosticStepsSubject.next(data);
      }
    };

    this.eventSource.onerror = () => {
      const errorMessage = 'A connection error occurred';
      this.diagnosticStepsSubject.error(new Error(errorMessage));
      this.closeConnection();
    };

    return this.diagnosticStepsSubject.asObservable();
  }

  private closeConnection() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
  }

  getMockDiagnosticSteps(
    vin: string,
  ): Observable<ApiResponseModel<DiagnosticStep[]>> {
    const dataSource1: DiagnosticStep[] = [
      {
        status: 1,
        title: 'Placeholder 1',
        description: 'Description for step 1',
      },
      {
        status: 1,
        title: 'Placeholder 2',
        description: 'Description for step 2',
      },
      {
        status: 1,
        title: 'Placeholder 3',
        description: 'Description for step 3',
      },
      {
        status: 1,
        title: 'Placeholder 4',
        description: 'Description for step 4',
      },
      {
        status: 1,
        title: 'Placeholder 5',
        description: 'Description for step 5',
      },
    ];

    // Erstelle und gebe ein Observable zurück, das das ApiResponseModel enthält
    const response: ApiResponseModel<DiagnosticStep[]> = {
      data: dataSource1,
      code: '200',
      timestamp: new Date().toISOString(),
    };

    return of(response); // Wrapt `response` in ein Observable
  }
}
