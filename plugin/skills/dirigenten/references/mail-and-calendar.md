# Mail and calendar

When: mail a colleague or a customer, reply.

## message ◐

input:
```json
{"tool":"write","args":{"op":"message","to":"<to>","text":"<text>","about":"<about>","reply_to":"<reply_to>"}}
```
output:
```json
{"phase":"refused","say":{"happened":"Det sparades inte. Vad som behövs, med en mall, står i det som saknas.","now":"Det sparades inte. Vad som behövs, med en mall, står i det som saknas.","then":"Det sparades inte. Vad som behövs, med en mall, står i det som saknas."},"missing":[{"field":"about","template":"{\"tool\":\"write\",\"args\":{\"op\":\"message\",\"to\":\"<kollega>\",\"text\":\"<meddelandet>\"}}"}]}
```
next:
```json
{"tool":"write","args":{"op":"message","to":"<to>","text":"<text>","about":"<about>","reply_to":"<reply_to>","tool":"write","args":{"op":"message","to":"<kollega>","text":"<meddelandet>"}}}
```

## mail draft ■

input:
```json
{"tool":"write","args":{"op":"mail_draft","values":"<values>"}}
```
output:
```json
{"phase":"read","say":{"happened":"v1:s verktyg är inte kopplat här.","now":"v1:s verktyg är inte kopplat här.","then":"v1:s verktyg är inte kopplat här."}}
```
next:
```json
null
```
