// see also https://github.com/okgrow/merge-graphql-schemas

// DateTime: see https://github.com/graphql/graphql-js/issues/497

exports.types = `

  # A date/time.
  scalar DateTime

  # You can query on these types.
  type Query {
    hello: String,
    # Get DataSphere Overview.
      dataSphere: DataSphere,
    # Get user by 'id'.
      user(id:Int): [User],
    # Get all users.
      users: [User],
    # Get files by 'type' = {ALL|DIRECTORY|FILE}.
      files(type:FileType): [File],
    # Get filesStats by 'inode'.
      filesStats(inode:Int): [FileStats],
    # Get all events.
      events: [Events],
    # Get all tasks.
      tasks: [Tasks],
    # Get activity metrics.
      activity: [Activity],
    # Get alignment metrics.
      alignment: Alignment,
    # Get performance metrics.
      performance: Performance,
    # Get capacity metrics.
      capacity: Capacity
  }
  
  # File type.
  enum FileType {
    ALL
    DIRECTORY
    FILE
  }
  
  # A user.
  type User {
    id: Int!,
    date: DateTime,
    name: String,
    files: [File],
    filesStats: [FileStats]
  }

  # A file.
  type File {
    executable: Boolean,
    explicit: Boolean,
    lastModified: String,
    logicalSize: String,
    name: String,
    parent: String,
    path: String,
    permanentDataLoss:Boolean,
    physicalSize: String,
    profileName: String,
    readable:Boolean,
    shareName: String,
    sharePath: String,
    size: String,
    sloTargets: String,
    slos: String,
    type: String,
    volumes: String,
    writable:Boolean
  }

  # A set of statistics for a file.  Columns defines units and order, rows contain values.
  type FileStats {
    name: String,
    tags: String,
    columns: [String],
    rows: [PdfsStats]
  }

  type PdfsStats {
    inode: Int,
    clientId: Int,
    instanceId: Int,
    avgIops: Int,
    objectId: Int,
    time: String,
    timeStamp: String
  }

  # An event with a type, severity, parameters, etc.
  type Events {
    severity: String,
    type: String,
    params: [String]
    created: String,
    cleared: Boolean,
    clearTime: String
  }

  # An asynchronous task with a name, status, progress, etc.
  type Tasks {
    name: String,
    paramsMap: String,
    paramsMapJson: String,
    created: String,
    started: String,
    status: String,
    progress: Int,
    exitValue: String
  }

  # Activity on a share or volume.
  type Activity {
    storageVolume: Volume,
    share: Share,
    timestamp: String,
    maxReadOps: Float,
    maxWriteOps: Float
  }

  # A volume.
  type Volume {
    name: String,
    operState: String
  }

  # A Share.
  type Share {
    name: String,
    path: String,
    space: CapacityAtom,
    totalNumberOfFiles: Int
  }

  # Common structure across Alignment, Performance, and Capacity records.
  interface moeData {
    max: Float,
    breakdown: [MoeBreakdown]
  }

  # Alignment of physical or logical storage.
  type Alignment implements moeData {
    max: Float,
    breakdown: [MoeBreakdown]
  }

  # Performance of physical or logical storage.
  type Performance implements moeData {
    max: Float,
    breakdown: [MoeBreakdown]
  }

  # Capacity of physical or logical storage. AKA 'Space'.
  type Capacity implements moeData {
    max: Float,
    breakdown: [MoeBreakdown]
  }

  type MoeBreakdown {
    share: String,
    storageContainer: String,
    data: String
  }

  type CapacityAtom {
    available: String,
    total: String,
    used: String,
    percent: Int
  }



  type Id {
    uoid: String!,
    type: ResourceType!,
    name: String!,
    description: String
  }

  type DataSphere {
    admins: [UserAuth],
    virtualDataSpheres: [VirtualDataSphere]
  }

  type VirtualDataSphere {
    id: Id,
    location: String,
    admins: [UserAuth],
    health: Health,
    capabilities: Capabilities,
    computeResources: [ComputeResources],
    storageResources: [StorageResources],
    communicationResources: [CommunicationResources],
    activeUsers: [UserAuth]
  }

  type Health {
    capacityHealth: [UserMessage],
    performanceHealth: [UserMessage],
    storageAlignment: [UserMessage]
  }

  type UserAuth {
    userId: Id,
    roles: [String]
  }

  type UserMessage {
    messageTemplate: String,
    data: [String]
  }

  type ActivityRollup {
    id: Id,
    utilization: Capabilities
  }

  type DataMotion {
    from: Id,
    to: Id,
    capacities: Capacities
  }

  enum Severity {
    INFO
    WARNING
    FAILURE
  }

  type ComputeResources {
    cpu: String
  }

  type CommunicationResources {
    networkInterfaces: [NetworkInterface]
  }

  type NetworkInterface {
    id: Id,
    nodeId: Id,
    bandwidths: Bandwidths,
    operations: Operations,
    latencies:  Latencies
  }

  type StorageResources {
    shares: [StorageResource],
    collections: [StorageResource],
    storageGroups: [StorageResource]
    nodes: [StorageResource],
    volumes: [StorageResource]
  }

  type StorageResource {
    id: Id,
    health: Health,
    capabilities: Capabilities,
    utilization: Capabilities,
    mostActiveChildren: [ActivityRollup],
    leastActiveChildren: [ActivityRollup]
  }  
  
  enum ResourceType {
    COLLECTION
    SHARE
    STORAGE_GROUP
    NODE
    VOLUME
    NETWORK_INTERFACE
    USER
  }

  type Capabilities {
    files:      FileCapabilities,
    capacities: Capacities,
    bandwidths: Bandwidths,
    operations: Operations,
    latencies:  Latencies
  }

  type FileCapabilities {
    totalInodes: Int,
    availableInodes: Int,
    usedInodes: Int,
    otherInodes: Int
  }

  type Capacities {
    totalMB: Int,
    availableMB: Int,
    usedMB: Int,
    otherMB: Int
  }

  type Bandwidths {
    ReadMBPerSecond: Int,
    WriteMBPerSecond: Int,
    averages: AverageMetrics
  }  

  type Operations {
    ReadPerSecond: Int,
    WritePerSecond: Int,
    MetaDataReadPerSecond: Int,
    MetaDataWritePerSecond: Int,
    averages: AverageMetrics
  }  

  type Latencies {
    ReadMs: Int,
    WriteMs: Int,
    averages: AverageMetrics
  }  

  type AverageMetrics {
    metricType: MetricType,
    timeSpan: TimeSpan,
    data: MetricData
  }

  enum MetricType {
    CAPACITIES
    BANDWIDTHS
    OPERATIONS
    LATENCIES
  }

  union MetricData = Capacities | Bandwidths | Operations | Latencies

  enum TimeSpan {
    MINUTE
    HOUR
    DAY
    WEEK
    MONTH
    YEAR
    FOREVER
  }
`;

//   type Alignment {
//     entity: Id,
//     currentAlignment: Id,
//     askAlignment: Id,
//     asOf: Date
//     severity: Severity
//   }

