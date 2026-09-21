# Rotor · dirigenten — plugin

Pluginen som kopplar Claude till **dirigenten**, Rotors register för vad som är
lovat kunder, vad som ska göras och vilka frågor som väntar.

Det här repot innehåller bara plugin-skalet: adressen till ytan, en krok, en
skill och vyn. Servern, registret och allt som rör kunddata ligger bakom
`https://rotor-dirigenten.netlify.app/mcp` och är inte publikt. Du loggar in
med ditt Rotor-konto, och din behörighet avgör vad du ser.

## Installera

```
/plugin marketplace add rotor-data/rotor-dirigenten-plugin
/plugin install rotor-dirigenten@rotor
```

Pluginen är till för Rotors egna medarbetare; utan ett konto hos oss finns det
ingenting att logga in på.
