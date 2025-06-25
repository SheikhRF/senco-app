Supabase password = SencoApp123

sql:
-- Pupils Table
create table Pupil (
  Pupil_ID uuid primary key default uuid_generate_v4(),
  forename text,
  surname text,
  email text unique,
  house text,
  tutor text
);

-- Diagnosis Table
create table Diagnosis (
  Label_ID uuid primary key default uuid_generate_v4(),
  Label text,
  Description text
);

-- Barriers Table
create table Barrier (
  Barrier_ID uuid primary key default uuid_generate_v4(),
  Barrier text,
  Description text
);

-- Strategies Table
create table Strategies (
  Strategy_ID uuid primary key default uuid_generate_v4(),
  Strategy text,
  Description text
);

-- Junction tables
create table Pupil_Diagnosis (
  Pupil_ID uuid references Pupil(Pupil_ID),
  Label_ID uuid references Diagnosis(Label_ID),
  primary key (Pupil_ID, Label_ID)
);

create table Barrier_Diagnosis (
  Barrier_ID uuid references Barrier(Barrier_ID),
  Diagnosis_ID uuid references Diagnosis(Label_ID),
  primary key (Barrier_ID, Diagnosis_ID)
);

create table Strategy_Barrier (
  Strategy_ID uuid references Strategies(Strategy_ID),
  Barrier_ID uuid references Barrier(Barrier_ID),
  primary key (Strategy_ID, Barrier_ID)
);
