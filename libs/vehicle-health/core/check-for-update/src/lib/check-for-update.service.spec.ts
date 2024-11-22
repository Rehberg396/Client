import { TestBed } from '@angular/core/testing';
import { SwUpdate } from '@angular/service-worker';
import { CheckForUpdateService } from './check-for-update.service';
import { Observable, of, take } from 'rxjs';

describe(CheckForUpdateService.name, () => {
  let service: CheckForUpdateService;

  const swUpdate = {
    isEnabled: false,
    checkForUpdate: jest.fn(),
    versionUpdates: of(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: CheckForUpdateService,
          useFactory: () => {
            return new CheckForUpdateService(swUpdate as unknown as SwUpdate);
          },
        },
      ],
    });
    service = TestBed.inject(CheckForUpdateService);
  });

  describe('intervalCheckUpdate', () => {
    it('should not throw exception when check update is thrown', (done) => {
      swUpdate.checkForUpdate.mockRejectedValue(new Error('an error'));
      service
        .intervalCheckUpdate(50)
        .pipe(take(1))
        .subscribe((result) => {
          expect(result).toBe(false);
          done();
        });
    });

    it('should return true when there is no error', (done) => {
      swUpdate.checkForUpdate.mockResolvedValue(true);
      service
        .intervalCheckUpdate(50)
        .pipe(take(1))
        .subscribe((result) => {
          expect(result).toBe(true);
          done();
        });
    });

    it('should ', (done) => {
      const expected = [true, false];
      const actual: boolean[] = [];
      let count = 0;
      swUpdate.checkForUpdate
        .mockResolvedValueOnce(true)
        .mockRejectedValueOnce(new Error('an error'));

      service
        .intervalCheckUpdate(50)
        .pipe(take(2))
        .subscribe((result) => {
          count++;
          actual.push(result);
          if (count == 2) {
            expect(expected).toEqual(actual);
            done();
          }
        });
    });
  });

  describe('versionUpdates', () => {
    it('should return an observable', () => {
      expect(service.versionUpdates()).toBeInstanceOf(Observable);
    });
  });

  describe('checkForUpdate', () => {
    it('should emit true', (done) => {
      swUpdate.checkForUpdate.mockResolvedValue(true);
      service.checkForUpdate().subscribe((next) => {
        expect(next).toBe(true);
        done();
      });
    });
    it('should emit false', (done) => {
      swUpdate.checkForUpdate.mockResolvedValue(false);
      service.checkForUpdate().subscribe((next) => {
        expect(next).toBe(false);
        done();
      });
    });
    it('should emit an error', (done) => {
      swUpdate.checkForUpdate.mockRejectedValue(new Error('an error'));
      service.checkForUpdate().subscribe({
        error: (err: Error) => {
          expect(err.message).toBe('an error');
          done();
        },
      });
    });
  });
});
