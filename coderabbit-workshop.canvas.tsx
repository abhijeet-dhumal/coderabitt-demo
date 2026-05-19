import {
  BarChart,
  PieChart,
  Card,
  CardBody,
  CardHeader,
  Callout,
  Code,
  DiffStats,
  DiffView,
  Divider,
  Grid,
  H1,
  H2,
  H3,
  Pill,
  Row,
  Select,
  Spacer,
  Stack,
  Stat,
  Table,
  Text,
  useCanvasState,
} from 'cursor/canvas';

type Section = 'audience' | 'story' | 'local' | 'pr' | 'exercises';

function CodeBlock({ children }: { children: string }) {
  return (
    <Code style={{ display: 'block', whiteSpace: 'pre', overflowX: 'auto', padding: '12px 14px' }}>
      {children}
    </Code>
  );
}

// ─── WORKSHOP HEADER ────────────────────────────────────────────────────────

function WorkshopMeta() {
  return (
    <Row gap={16} style={{ flexWrap: 'wrap' }}>
      <Text tone="secondary" size="small">May 21, 2026</Text>
      <Text tone="secondary" size="small">·</Text>
      <Text tone="secondary" size="small">2:00 – 3:30 PM</Text>
      <Text tone="secondary" size="small">·</Text>
      <Text tone="secondary" size="small">90 min · Hands-on</Text>
      <Text tone="secondary" size="small">·</Text>
      <Text tone="secondary" size="small">26 attendees</Text>
    </Row>
  );
}

// ─── SECTION: AUDIENCE ──────────────────────────────────────────────────────

function AudienceSection() {
  return (
    <Stack gap={24}>
      <H2>Audience Today</H2>
      <Text tone="secondary">You filled out a pre-workshop survey. Here's what you told us.</Text>

      <Grid columns={2} gap={24}>
        <Stack gap={8}>
          <H3>Who's in the room</H3>
          <Text tone="secondary" size="small">26 responses · by AI review tool experience</Text>
          <PieChart
            donut
            data={[
              { label: 'New to AI review (42%)', value: 11 },
              { label: 'CodeRabbit users (27%)', value: 7, tone: 'success' },
              { label: 'Copilot Review (19%)', value: 5 },
              { label: 'Qodo (8%)', value: 2 },
              { label: 'Cursor (4%)', value: 1 },
            ]}
          />
        </Stack>
        <Stack gap={8}>
          <H3>Key numbers</H3>
          <Stack gap={12}>
            <Stat value="26" label="Attendees" />
            <Stat value="73%" label="Say reviews take too long" tone="warning" />
            <Stat value="52%" label="Review PRs daily (rated 4–5)" tone="info" />
            <Stat value="38%" label="Comfortable with AI tools (rated 5/5)" tone="success" />
          </Stack>
        </Stack>
      </Grid>

      <Divider />

      <H3>Your biggest pain points with code reviews</H3>
      <Text tone="secondary" size="small">26 responses · multi-select</Text>
      <BarChart
        horizontal
        height={200}
        categories={[
          'Reviews take too long',
          'Context switching',
          'Inconsistent feedback',
          'Not enough reviewers',
          'Bugs reach production',
        ]}
        series={[{ name: 'Respondents', data: [19, 10, 6, 6, 4] }]}
      />

      <Callout tone="info" title="Why we're here">
        73% of you said reviews take too long. Today we'll show how CodeRabbit cuts that wait — catching issues in your IDE before you push, and reviewing every PR automatically the moment it opens.
      </Callout>

      <Divider />

      <H3>Your comfort with AI coding tools</H3>
      <Text tone="secondary" size="small">26 responses · 1 = not comfortable, 5 = very comfortable</Text>
      <BarChart
        height={180}
        categories={['1', '2', '3', '4', '5']}
        series={[{ name: 'Respondents', data: [4, 4, 5, 3, 10] }]}
      />

      <Divider />

      <H3>How often do you review or submit PRs?</H3>
      <Text tone="secondary" size="small">25 responses · 1 = rarely, 5 = daily</Text>
      <BarChart
        height={160}
        categories={['1 — rarely', '2', '3', '4', '5 — daily']}
        series={[{ name: 'Respondents', data: [5, 2, 5, 7, 6] }]}
      />

      <Divider />

      <H3>Topics you asked us to cover</H3>
      <Table
        headers={['Topic', "What we'll show"]}
        rows={[
          ['Security rules', 'Custom path_instructions in .coderabbit.yaml — we\'ll demo this live'],
          ['Monorepo support', 'path_filters config to include/exclude file trees'],
          ['Integration testing', '@coderabbitai generate unit tests command'],
        ]}
      />
    </Stack>
  );
}

// ─── SECTION: STORY ─────────────────────────────────────────────────────────

function StorySection() {
  return (
    <Stack gap={24}>
      <H2>The Scenario</H2>
      <Text tone="secondary">
        A real repository with real mistakes. Everything CodeRabbit flags today is code that looks fine at first glance — and ships to production all the time.
      </Text>

      <Grid columns={3} gap={12}>
        <Stat value="2 files" label="Changed in PR #1" />
        <Stat value="13" label="Issues found by CodeRabbit" tone="danger" />
        <Stat value="6" label="Critical severity" tone="danger" />
      </Grid>

      <Divider />

      <H3>What happened</H3>
      <Stack gap={8}>
        <Text>A developer builds a Flask auth feature: registration, login with token generation, and an admin endpoint — two files, ~60 lines of code.</Text>
        <Text>The code looks reasonable. It runs. Tests pass. But it contains 13 issues across security, correctness, and configuration — none caught before the PR was opened.</Text>
        <Text>We'll use CodeRabbit to catch them <strong>before</strong> the push (IDE extension) and <strong>after</strong> the push (automated PR review on GitHub).</Text>
      </Stack>

      <Divider />

      <H3>The code</H3>

      <Card>
        <CardHeader>auth.py</CardHeader>
        <CardBody>
          <CodeBlock>{`SECRET_KEY = "supersecret123"      # hardcoded secret

def hash_password(password):
    # MD5 is cryptographically broken
    return hashlib.md5(password.encode()).hexdigest()

def register_user(username, password):
    hashed = hash_password(password)
    conn = sqlite3.connect(DB_PATH)
    query = f"INSERT INTO users (username, password) VALUES ('{username}', '{hashed}')"
    try:
        conn.execute(query)    # SQL injection
        conn.commit()
    except:                    # bare except — swallows all errors
        pass

def login_user(username, password):
    hashed = hash_password(password)
    query = f"SELECT * FROM users WHERE username='{username}' AND password='{hashed}'"
    cursor = conn.execute(query)   # SQL injection
    if cursor.fetchone():
        token = hashlib.md5((username + SECRET_KEY).encode()).hexdigest()
        return {"token": token}    # deterministic, forgeable, never expires

def get_all_users():
    cursor = conn.execute("SELECT id, username, password FROM users")
    return cursor.fetchall()       # exposes password hashes`}</CodeBlock>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>app.py</CardHeader>
        <CardBody>
          <CodeBlock>{`@app.route("/register", methods=["POST"])
def register():
    data = request.json
    result = register_user(data["username"], data["password"])  # no input validation
    return jsonify(result)

@app.route("/login", methods=["POST"])
def login():
    data = request.json
    result = login_user(data["username"], data["password"])
    if result:
        return jsonify(result)
    return jsonify({"error": "Invalid username"}), 401  # username enumeration

@app.route("/admin/users")
def admin_users():
    # no authentication check on admin endpoint
    users = get_all_users()
    return jsonify(users)

if __name__ == "__main__":
    init_db()
    app.run(debug=True, host="0.0.0.0")  # exposes debugger on the network`}</CodeBlock>
        </CardBody>
      </Card>

      <Callout tone="warning" title="Spot anything?">
        Most of these issues pass code review without AI assistance. They're not obvious — they're the kind of thing that ships.
      </Callout>

      <Divider />

      <H3>Demo repo</H3>
      <Stack gap={4}>
        <Text>Repo: <strong>github.com/abhijeet-dhumal/coderabitt-demo</strong></Text>
        <Text>Live PR: <strong>github.com/abhijeet-dhumal/coderabitt-demo/pull/1</strong></Text>
        <Text>Branch: <strong>feat/add-user-auth</strong></Text>
      </Stack>
    </Stack>
  );
}

// ─── SECTION: ACT 1 — LOCAL REVIEW ──────────────────────────────────────────

function LocalSection() {
  return (
    <Stack gap={24}>
      <H2>Act 1 — Review Before You Push</H2>
      <Grid columns={3} gap={12}>
        <Stat value="20 min" label="This segment" />
        <Stat value="0" label="PRs needed" />
        <Stat value="Pre-push" label="Stage" />
      </Grid>

      <Callout tone="info" title="The idea">
        You don't have to wait for a PR review to get feedback. CodeRabbit works directly in your IDE on staged changes — before you push, before your team sees it.
      </Callout>

      <Divider />

      <H3>Setup — 5 minutes</H3>
      <Table
        headers={['Step', 'What to do']}
        rows={[
          ['Install', 'Extensions → search "CodeRabbit" → Install (publisher: CodeRabbit)'],
          ['Sign in', 'Robot icon in activity bar → Sign in with GitHub → Authorize in browser'],
          ['Verify', 'Your username appears in the CodeRabbit panel'],
        ]}
      />

      <Divider />

      <H3>Part 1 — Review staged changes</H3>
      <Stack gap={6}>
        <Text><strong>1.</strong> Check out branch <code>feat/add-user-auth</code>.</Text>
        <Text><strong>2.</strong> Stage the file: <code>git add auth.py</code></Text>
        <Text><strong>3.</strong> CodeRabbit panel → <strong>Review Staged Changes</strong>.</Text>
        <Text><strong>4.</strong> Inline comments appear within ~20s — MD5 hashing, hardcoded secret, SQL injection flagged directly in the file.</Text>
      </Stack>

      <H3>Part 2 — Review a selection</H3>
      <Stack gap={6}>
        <Text><strong>1.</strong> Select the <code>register_user</code> function in auth.py.</Text>
        <Text><strong>2.</strong> Right-click → <strong>CodeRabbit: Review Selection</strong>.</Text>
        <Text><strong>3.</strong> CodeRabbit focuses only on what you selected — no noise from the rest of the file.</Text>
      </Stack>

      <H3>Part 3 — Inline chat and apply a fix</H3>
      <Stack gap={6}>
        <Text><strong>1.</strong> Hover the SQL injection comment → click the chat bubble icon.</Text>
        <CodeBlock>{`Why is this a problem? Show me a corrected version.`}</CodeBlock>
        <Text><strong>2.</strong> CodeRabbit replies with a parameterized query fix. Click <strong>Apply fix</strong> — the edit lands in the file.</Text>
        <Text><strong>3.</strong> No context switch. No PR. No waiting.</Text>
      </Stack>

      <Divider />

      <Callout tone="success" title="After fixing locally and pushing">
        This is where the team-wide gate kicks in — CodeRabbit automatically reviews the PR the moment it opens on GitHub.
      </Callout>
    </Stack>
  );
}

// ─── SECTION: ACT 2 — PR REVIEW ─────────────────────────────────────────────

function PRSection() {
  return (
    <Stack gap={24}>
      <H2>Act 2 — Automated PR Review</H2>
      <Grid columns={4} gap={12}>
        <Stat value="35 min" label="This segment" />
        <Stat value="13" label="Issues found" tone="danger" />
        <Stat value="6" label="Critical" tone="danger" />
        <Stat value="7" label="Inline comments" tone="warning" />
      </Grid>

      <Text tone="secondary">
        Live demo: <strong>github.com/abhijeet-dhumal/coderabitt-demo/pull/1</strong>
      </Text>

      <Divider />

      <H3>What CodeRabbit posts automatically</H3>
      <Stack gap={6}>
        <Text>As soon as the PR opens, CodeRabbit posts a full review — no trigger needed:</Text>
        <Text>— <strong>PR Summary</strong>: "New Features" bullet list describing what changed.</Text>
        <Text>— <strong>Walkthrough</strong>: 2-file breakdown by layer, estimated review effort: 4 (Complex) · ~45 min.</Text>
        <Text>— <strong>Pre-merge checks</strong>: 1 failed (Docstring Coverage 0%), 4 passed.</Text>
        <Text>— <strong>7 inline comments</strong> on the Files Changed tab, each with severity and a suggested fix.</Text>
      </Stack>

      <Divider />

      <H3>Inline findings</H3>
      <Table
        headers={['File', 'Lines', 'Finding', 'Severity']}
        rows={[
          ['app.py', '43–47', 'Admin endpoint has no auth — anyone can enumerate all users', 'Critical'],
          ['app.py', '51–52', 'debug=True + host="0.0.0.0" — remote code execution risk', 'Major'],
          ['auth.py', '4–5', 'Hardcoded SECRET_KEY — tokens are forgeable by anyone who reads the source', 'Critical'],
          ['auth.py', '11–13', 'No UNIQUE constraint + bare except swallows insert errors silently', 'Major'],
          ['auth.py', '18–20', 'MD5 password hashing — offline crackable in seconds', 'Critical'],
          ['auth.py', '27–29', 'SQL injection in both register and login queries', 'Critical'],
          ['auth.py', '52–57', 'get_all_users() returns password hashes to every caller', 'Critical'],
        ]}
        rowTone={['danger', 'warning', 'danger', 'warning', 'danger', 'danger', 'danger']}
      />

      <Divider />

      <H3>CodeRabbit's suggested fixes</H3>

      <Card>
        <CardHeader trailing={<DiffStats additions={2} deletions={2} />}>
          auth.py — SQL injection fix
        </CardHeader>
        <CardBody style={{ padding: 0 }}>
          <DiffView
            path="auth.py"
            lines={[
              { type: 'unchanged', content: 'def register_user(username, password):', lineNumber: 24 },
              { type: 'unchanged', content: '    hashed = hash_password(password)', lineNumber: 25 },
              { type: 'unchanged', content: '    conn = sqlite3.connect(DB_PATH)', lineNumber: 26 },
              { type: 'removed',   content: '    query = f"INSERT INTO users (username, password) VALUES (\'{username}\', \'{hashed}\')"', lineNumber: 27 },
              { type: 'removed',   content: '    conn.execute(query)', lineNumber: 28 },
              { type: 'added',     content: '    query = "INSERT INTO users (username, password) VALUES (?, ?)"', lineNumber: 27 },
              { type: 'added',     content: '    conn.execute(query, (username, hashed))', lineNumber: 28 },
            ]}
          />
        </CardBody>
      </Card>

      <Card>
        <CardHeader trailing={<DiffStats additions={4} deletions={1} />}>
          app.py — Flask debug exposure fix
        </CardHeader>
        <CardBody style={{ padding: 0 }}>
          <DiffView
            path="app.py"
            lines={[
              { type: 'unchanged', content: 'if __name__ == "__main__":', lineNumber: 49 },
              { type: 'unchanged', content: '    init_db()', lineNumber: 50 },
              { type: 'removed',   content: '    app.run(debug=True, host="0.0.0.0")  # debug=True and 0.0.0.0 in production', lineNumber: 51 },
              { type: 'added',     content: '    app.run(', lineNumber: 51 },
              { type: 'added',     content: '        debug=os.getenv("FLASK_DEBUG") == "1",', lineNumber: 52 },
              { type: 'added',     content: '        host=os.getenv("FLASK_HOST", "127.0.0.1"),', lineNumber: 53 },
              { type: 'added',     content: '    )', lineNumber: 54 },
            ]}
          />
        </CardBody>
      </Card>

      <Divider />

      <H3>Chat with CodeRabbit in the PR</H3>
      <Stack gap={8}>
        <Text>You can ask CodeRabbit anything about the PR in a comment:</Text>
        <CodeBlock>{`@coderabbitai list all issues identified`}</CodeBlock>
        <Text tone="secondary" size="small">Returns the full 13-issue breakdown: 6 Critical · 3 High · 4 Medium.</Text>
        <CodeBlock>{`@coderabbitai What's the biggest security risk in this PR?`}</CodeBlock>
        <Text tone="secondary" size="small">Identifies unauthenticated admin endpoint + MD5 + SQL injection as the top three.</Text>
        <CodeBlock>{`@coderabbitai generate unit tests for the new functions in this PR`}</CodeBlock>
        <Text tone="secondary" size="small">Returns test stubs in your project's existing framework.</Text>
      </Stack>

      <Divider />

      <H3>All 13 issues</H3>
      <Table
        headers={['#', 'File', 'Issue', 'Severity']}
        rows={[
          ['1', 'auth.py', 'SQL injection — f-string query building in register and login', 'Critical'],
          ['2', 'auth.py', 'MD5 password hashing — cryptographically broken, offline crackable', 'Critical'],
          ['3', 'auth.py', 'Hardcoded SECRET_KEY = "supersecret123" in source control', 'Critical'],
          ['4', 'app.py',  'Unauthenticated GET /admin/users — anyone can list all users', 'Critical'],
          ['5', 'auth.py', 'Weak token — MD5(username + SECRET_KEY), no expiry, forgeable', 'Critical'],
          ['6', 'auth.py', 'get_all_users() returns password hashes to every caller', 'Critical'],
          ['7', 'app.py',  '"Invalid username" error reveals whether a username exists', 'High'],
          ['8', 'app.py',  'No input validation on /register — missing fields crash with KeyError', 'High'],
          ['9', 'app.py',  'debug=True + host="0.0.0.0" — Werkzeug debugger open to the network', 'High'],
          ['10', 'auth.py', 'Mutable default argument roles=[] shared across all calls', 'Medium'],
          ['11', 'auth.py', 'Bare except hides all DB errors, including duplicate usernames', 'Medium'],
          ['12', 'auth.py', 'DB connections not using context managers — leaks on error', 'Medium'],
          ['13', 'app.py',  'No rate limiting on /login — open to brute-force attacks', 'Medium'],
        ]}
        rowTone={['danger','danger','danger','danger','danger','danger','warning','warning','warning',undefined,undefined,undefined,undefined]}
      />

      <Divider />

      <H3>Custom security rules</H3>
      <Text>You can teach CodeRabbit your team's specific conventions with <code>path_instructions</code>:</Text>
      <CodeBlock>{`# .coderabbit.yaml
reviews:
  profile: "assertive"
  path_instructions:
    - path: "**/*.py"
      instructions: >
        Flag endpoints missing authentication decorators.
        Flag any use of MD5 or SHA1 for password hashing.
        Flag hardcoded secrets or API keys.`}</CodeBlock>
      <Text tone="secondary" size="small">Once committed to your default branch, every PR is reviewed against these rules automatically.</Text>
    </Stack>
  );
}

// ─── SECTION: EXERCISES ─────────────────────────────────────────────────────

function ExercisesSection() {
  return (
    <Stack gap={24}>
      <H2>Hands-on</H2>
      <Grid columns={3} gap={12}>
        <Stat value="25 min" label="Total time" />
        <Stat value="2" label="Exercises" />
        <Stat value="~12 min" label="Each" />
      </Grid>

      <Divider />

      <H3>Exercise 1 — Catch it before it leaves your machine</H3>
      <Row gap={8} style={{ marginBottom: 4 }}><Pill tone="neutral">Extension</Pill></Row>
      <Stack gap={6}>
        <Text><strong>1.</strong> Clone the demo repo. Create a branch: <code>git checkout -b ex1/&lt;yourname&gt;</code></Text>
        <Text><strong>2.</strong> Add a file with at least 2 of these issues:</Text>
        <Table
          headers={['Issue type', 'Example']}
          rows={[
            ['Broad exception', 'except Exception: pass'],
            ['Hardcoded secret', 'token = "ghp_abc123"'],
            ['Mutable default arg', 'def fn(items=[]): ...'],
            ['SQL string concat', 'f"SELECT * WHERE id={id}"'],
          ]}
        />
        <Text><strong>3.</strong> Stage → CodeRabbit panel → <strong>Review Staged Changes</strong>.</Text>
        <Text><strong>4.</strong> Open inline chat on one comment → ask for a fix → click Apply.</Text>
      </Stack>
      <Callout tone="success" title="Goal">
        At least one issue caught and fixed before the branch is pushed.
      </Callout>

      <Divider />

      <H3>Exercise 2 — Let CodeRabbit review your PR</H3>
      <Row gap={8} style={{ marginBottom: 4 }}><Pill tone="neutral">GitHub App</Pill></Row>
      <Stack gap={6}>
        <Text><strong>1.</strong> Push your branch and open a PR against main.</Text>
        <Text><strong>2.</strong> Wait ~60s for the automatic review. Read the Summary and Walkthrough.</Text>
        <Text><strong>3.</strong> Ask CodeRabbit two questions in the PR comments:</Text>
        <CodeBlock>{`@coderabbitai What's the overall risk level of this PR?`}</CodeBlock>
        <CodeBlock>{`@coderabbitai generate unit tests for the new functions`}</CodeBlock>
        <Text><strong>4.</strong> Fix one flagged issue → push → watch CodeRabbit re-review only the changed lines.</Text>
      </Stack>
      <Callout tone="success" title="Goal">
        A PR with a review, a risk assessment, and generated test stubs — all without asking a teammate.
      </Callout>

      <Divider />

      <H3>Discussion</H3>
      <Table
        headers={['Question', 'Takeaway']}
        rows={[
          ['Extension vs PR review — when do you use each?', 'Extension = your personal safety net before push; PR review = the team gate'],
          ['What do you do with a false positive?', 'Reply @coderabbitai ignore this, or add path_instructions exclusions'],
          ['Does this replace human review?', 'It replaces first-pass nit-picking — human review focuses on intent and design'],
          ['How do you roll this out to a team?', 'Start with "chill" profile; ramp up as the team agrees on what matters'],
        ]}
      />
    </Stack>
  );
}

// ─── ROOT ────────────────────────────────────────────────────────────────────

export default function CodeRabbitWorkshop() {
  const [section, setSection] = useCanvasState<Section>('audience');

  const sectionOptions = [
    { value: 'audience',  label: '0. Audience Today' },
    { value: 'story',     label: '1. The Scenario' },
    { value: 'local',     label: '2. Act 1: Review Before Push' },
    { value: 'pr',        label: '3. Act 2: Automated PR Review' },
    { value: 'exercises', label: '4. Hands-on' },
  ];

  return (
    <Stack gap={24} style={{ maxWidth: 880, margin: '0 auto', padding: '24px 16px' }}>
      <Stack gap={4}>
        <H1>Agentic Code Review Workshop</H1>
        <WorkshopMeta />
      </Stack>

      <Row gap={8} style={{ flexWrap: 'wrap' }}>
        <Select
          value={section}
          options={sectionOptions}
          onChange={(v) => setSection(v as Section)}
        />
        <Spacer />
        <Pill tone={section === 'audience'  ? 'success' : 'neutral'} onClick={() => setSection('audience')}>Audience</Pill>
        <Pill tone={section === 'story'     ? 'success' : 'neutral'} onClick={() => setSection('story')}>Scenario</Pill>
        <Pill tone={section === 'local'     ? 'success' : 'neutral'} onClick={() => setSection('local')}>Act 1</Pill>
        <Pill tone={section === 'pr'        ? 'success' : 'neutral'} onClick={() => setSection('pr')}>Act 2</Pill>
        <Pill tone={section === 'exercises' ? 'success' : 'neutral'} onClick={() => setSection('exercises')}>Hands-on</Pill>
      </Row>

      <Divider />

      {section === 'audience'  && <AudienceSection />}
      {section === 'story'     && <StorySection />}
      {section === 'local'     && <LocalSection />}
      {section === 'pr'        && <PRSection />}
      {section === 'exercises' && <ExercisesSection />}
    </Stack>
  );
}
