import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TokenJwtComponent } from './token-jwt.component';

describe('TokenJwtComponent', () => {
  let component: TokenJwtComponent;
  let fixture: ComponentFixture<TokenJwtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TokenJwtComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TokenJwtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
