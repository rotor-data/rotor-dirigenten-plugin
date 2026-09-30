# Prompt method reference

Use this reference when prompt quality, brand translation, failure diagnosis, or alternative prompt strategy matters.

## The five useful questions

Prefer questions that clarify the image's function rather than technical execution.

1. What job does the image have?
   - sell, explain, attract attention, create atmosphere, show a product, support a slide, act as editorial image, become a hero image
2. What must be visibly correct?
   - object details, brand cues, person consistency, product proportions, local/cultural realism, layout, text area
3. What should it feel like?
   - documentary, premium, rough, everyday, warm, clinical, strange, quiet, urgent, understated, playful
4. What is the visual form?
   - photo, editorial illustration, product mockup, diagram, poster, social ad, presentation image, web hero
5. What usually goes wrong?
   - too glossy, too centered, too childish, wrong culture/place, wrong material, bad text, cropped objects, ignored details

## Loose idea gate

When the user gives a loose idea, do not produce the final prompt first. Ask first unless the user explicitly requests immediate output.

A loose idea includes:
- only a subject: "a house with solar panels"
- a subject plus mood: "warm documentary photo"
- a brand platform without channel/use case
- a failed image complaint without the original prompt or desired use
- a request like "help me make a prompt" or "ta fram en prompt"

Ask 3-5 questions. If the brand/aesthetic direction is already clear, do not ask about it again; ask about function, format, text space, critical details, and known failure modes.

## Brand-platform intake

When the user pastes brand or visual identity language:

1. Restate the distilled visual direction in one sentence.
2. Convert brand words into visible image variables.
3. Ask only for missing production choices.
4. Write the English prompt after the user answers or after they ask for a draft.

Example translation:
- "documentary" -> observed, real-world scene, unforced framing, eye-level/street-level view
- "warm" -> natural daylight, human traces, inviting everyday details
- "analog" -> mild grain, natural contrast, non-glossy textures
- "not staged" -> asymmetry, imperfect garden/room, plausible clutter, non-showroom environment
- "human" -> visible people or signs someone lives/works there
- "natural light" -> overcast daylight, window light, late-afternoon light, no studio feel

## Prompt strength hierarchy

Weakest: generic quality words
- realistic, high quality, 4k, beautiful, professional, perfect lighting

Better: visible properties
- matte black surface, overcast daylight, lived-in Swedish suburb, off-center composition, paper grain

Best: role-specific visual direction
- documentary street-level photo, subject in right third, pale sky as negative space for headline, natural contrast, realistic roof-panel spacing

## Realism repair patterns

If the image looks glossy or artificial, add:
- ordinary lived-in environment
- natural or imperfect light
- realistic proportions and spacing
- mild grain, handheld framing, natural contrast
- specific local context instead of generic global stock imagery

If the image looks like a render, remove or avoid:
- cinematic, perfect lighting, ultra detailed, unreal engine, 8k, glossy, luxury, hyperrealistic

Replace with:
- documentary photo, editorial photograph, natural daylight, unpolished everyday setting, credible imperfections

## Composition repair patterns

If the image is too centered:
- place the subject in the left/right/lower third
- asymmetrical editorial composition
- foreground element framing the subject

If the image needs text space:
- specify exact area: left half, upper right, pale sky, clean wall, empty table surface
- specify format: 16:9 hero image, 4:5 social ad, square cover, vertical poster

If important objects get cropped:
- full object visible within the frame
- leave margin around the object
- medium-distance view rather than close-up

## Positive constraint conversions

Bad: no stripes on the solar panels
Good: smooth homogeneous matte black solar panels

Bad: don't make it look like AI
Good: documentary editorial photo with natural contrast, imperfect everyday environment, realistic textures

Bad: no childish cartoon
Good: mature editorial illustration, restrained palette, ink hatching, sparse composition

Bad: don't crop the product
Good: full product visible with comfortable margin on all sides

Bad: no American-looking suburb
Good: ordinary Swedish residential street, restrained house design, Nordic vegetation, overcast daylight

## Alternative prompt types

When offering alternatives, make them strategically distinct, not just lightly reworded.

Useful variant axes:
- documentary vs editorial vs commercial
- close human moment vs wider environmental context
- photo vs illustration vs graphic poster
- premium/polished vs lived-in/credible
- minimal layout vs detail-rich scene

## Diagnosis template

When a user asks “why did it turn out like this?” answer with:

1. likely cause
2. what in the prompt invited that result
3. what to change
4. revised copy-ready prompt

Keep the diagnosis practical. Avoid pretending to know the model's internal process.
